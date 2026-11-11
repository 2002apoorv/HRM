const { Product } = require('../../models/sales/Product');
const { ProductBatch } = require('../../models/sales/ProductBatch');
const { InventoryMovement } = require('../../models/sales/InventoryMovement');

const getProducts = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { search, category, status, stockStatus, page = 1, limit = 50 } = req.query;

    const query = { organizationId: orgId };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (stockStatus === 'low') {
      query.$expr = { $lte: ['$currentStock', '$reorderThreshold'] };
    } else if (stockStatus === 'out') {
      query.currentStock = { $lte: 0 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [products, totalCount] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Product.countDocuments(query),
    ]);

    // Categories in this organization
    const categories = await Product.distinct('category', { organizationId: orgId });

    return res.status(200).json({
      success: true,
      products,
      categories,
      totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
    });
  } catch (err) {
    console.error('Get products error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.organizationId;

    const product = await Product.findOne({ _id: id, organizationId: orgId });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found in your organization' });
    }

    const batches = await ProductBatch.find({
      productId: product._id,
      organizationId: orgId,
    }).sort({ expiryDate: 1 });

    const movements = await InventoryMovement.find({
      productId: product._id,
      organizationId: orgId,
    })
      .sort({ timestamp: -1 })
      .limit(20);

    return res.status(200).json({ success: true, product, batches, movements });
  } catch (err) {
    console.error('Get product error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
};

const createProduct = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const {
      name,
      sku,
      barcode,
      category,
      description,
      purchaseCost,
      sellingPrice,
      reorderThreshold,
      unit,
      hasBatches,
      initialStock = 0,
      batchNumber,
      expiryDate,
    } = req.body;

    if (!name || !sku || sellingPrice === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Name, SKU, and Selling Price are required',
      });
    }

    // Check SKU uniqueness in this tenant
    const existingSku = await Product.findOne({
      organizationId: orgId,
      sku: sku.trim().toUpperCase(),
    });
    if (existingSku) {
      return res.status(400).json({
        success: false,
        error: 'A product with this SKU already exists in your organization',
      });
    }

    const newProduct = new Product({
      organizationId: orgId,
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      barcode: barcode ? barcode.trim() : '',
      category: category ? category.trim() : 'General',
      description: description ? description.trim() : '',
      purchaseCost: Number(purchaseCost) || 0,
      sellingPrice: Number(sellingPrice),
      reorderThreshold: Number(reorderThreshold) || 10,
      unit: unit ? unit.trim() : 'pcs',
      hasBatches: Boolean(hasBatches),
      currentStock: Number(initialStock) || 0,
    });

    await newProduct.save();

    // If initial stock provided
    const initStockNum = Number(initialStock) || 0;
    if (initStockNum > 0) {
      let createdBatch = null;
      if (hasBatches && batchNumber && expiryDate) {
        createdBatch = new ProductBatch({
          organizationId: orgId,
          productId: newProduct._id,
          batchNumber: batchNumber.trim().toUpperCase(),
          purchaseCost: Number(purchaseCost) || 0,
          sellingPrice: Number(sellingPrice),
          initialQuantity: initStockNum,
          currentQuantity: initStockNum,
          expiryDate: new Date(expiryDate),
        });
        await createdBatch.save();
      }

      await InventoryMovement.create({
        organizationId: orgId,
        productId: newProduct._id,
        batchId: createdBatch ? createdBatch._id : null,
        movementType: 'MANUAL_ADJUSTMENT',
        quantity: initStockNum,
        previousStock: 0,
        newStock: initStockNum,
        reason: 'Initial stock intake upon product creation',
        performedBy: req.user._id,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.organizationId;
    const {
      name,
      sku,
      barcode,
      category,
      description,
      purchaseCost,
      sellingPrice,
      reorderThreshold,
      unit,
      status,
      hasBatches,
    } = req.body;

    const product = await Product.findOne({ _id: id, organizationId: orgId });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found in your organization' });
    }

    if (sku && sku.trim().toUpperCase() !== product.sku) {
      const duplicate = await Product.findOne({
        organizationId: orgId,
        sku: sku.trim().toUpperCase(),
        _id: { $ne: product._id },
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          error: 'Another product with this SKU already exists',
        });
      }
      product.sku = sku.trim().toUpperCase();
    }

    if (name) product.name = name.trim();
    if (barcode !== undefined) product.barcode = barcode ? barcode.trim() : '';
    if (category) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (purchaseCost !== undefined) product.purchaseCost = Number(purchaseCost);
    if (sellingPrice !== undefined) product.sellingPrice = Number(sellingPrice);
    if (reorderThreshold !== undefined) product.reorderThreshold = Number(reorderThreshold);
    if (unit) product.unit = unit.trim();
    if (status) product.status = status;
    if (hasBatches !== undefined) product.hasBatches = Boolean(hasBatches);
    product.updatedAt = new Date();

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (err) {
    console.error('Update product error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.organizationId;

    const product = await Product.findOne({ _id: id, organizationId: orgId });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Set to inactive or delete if no movements
    const movementsCount = await InventoryMovement.countDocuments({
      productId: product._id,
      organizationId: orgId,
    });

    if (movementsCount > 1) {
      product.status = 'inactive';
      await product.save();
      return res.status(200).json({
        success: true,
        message: 'Product has active transaction history and was marked inactive',
      });
    }

    await ProductBatch.deleteMany({ productId: product._id, organizationId: orgId });
    await InventoryMovement.deleteMany({ productId: product._id, organizationId: orgId });
    await Product.deleteOne({ _id: product._id });

    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
};

const addBatch = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { productId, batchNumber, purchaseCost, sellingPrice, quantity, expiryDate } = req.body;

    if (!productId || !batchNumber || !quantity || !expiryDate) {
      return res.status(400).json({
        success: false,
        error: 'Product, batch number, quantity, and expiry date are required',
      });
    }

    const product = await Product.findOne({ _id: productId, organizationId: orgId });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found in your organization' });
    }

    const upperBatch = batchNumber.trim().toUpperCase();
    let batch = await ProductBatch.findOne({
      organizationId: orgId,
      productId: product._id,
      batchNumber: upperBatch,
    });

    const qtyNum = Number(quantity);
    if (batch) {
      batch.currentQuantity += qtyNum;
      batch.initialQuantity += qtyNum;
      batch.purchaseCost = Number(purchaseCost) || batch.purchaseCost;
      batch.sellingPrice = Number(sellingPrice) || batch.sellingPrice;
      batch.expiryDate = new Date(expiryDate);
      await batch.save();
    } else {
      batch = new ProductBatch({
        organizationId: orgId,
        productId: product._id,
        batchNumber: upperBatch,
        purchaseCost: Number(purchaseCost) || product.purchaseCost,
        sellingPrice: Number(sellingPrice) || product.sellingPrice,
        initialQuantity: qtyNum,
        currentQuantity: qtyNum,
        expiryDate: new Date(expiryDate),
      });
      await batch.save();
    }

    // Update product total stock
    const prevStock = product.currentStock;
    product.currentStock += qtyNum;
    product.hasBatches = true;
    await product.save();

    // Record movement
    await InventoryMovement.create({
      organizationId: orgId,
      productId: product._id,
      batchId: batch._id,
      movementType: 'MANUAL_ADJUSTMENT',
      quantity: qtyNum,
      previousStock: prevStock,
      newStock: product.currentStock,
      reason: `New batch ${upperBatch} received (Exp: ${new Date(expiryDate).toLocaleDateString()})`,
      performedBy: req.user._id,
    });

    return res.status(200).json({ success: true, message: 'Batch added successfully', batch });
  } catch (err) {
    console.error('Add batch error:', err);
    return res.status(500).json({ success: false, error: 'Failed to add batch' });
  }
};

const getBatches = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { productId, expiringInDays } = req.query;

    const query = { organizationId: orgId };
    if (productId) {
      query.productId = productId;
    }

    if (expiringInDays) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + parseInt(expiringInDays));
      query.expiryDate = { $lte: targetDate };
    }

    const batches = await ProductBatch.find(query)
      .populate('productId', 'name sku unit')
      .sort({ expiryDate: 1 });

    return res.status(200).json({ success: true, batches });
  } catch (err) {
    console.error('Get batches error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch batches' });
  }
};

const exportProductsCSV = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const products = await Product.find({ organizationId: orgId }).sort({ name: 1 });

    const header = ['SKU', 'Name', 'Category', 'Selling Price', 'Cost', 'Current Stock', 'Unit', 'Status'];
    const rows = products.map(p => [
      `"${p.sku}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.sellingPrice,
      p.purchaseCost,
      p.currentStock,
      `"${p.unit}"`,
      `"${p.status}"`,
    ]);

    const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    return res.status(200).send(csvContent);
  } catch (err) {
    console.error('Export CSV error:', err);
    return res.status(500).json({ success: false, error: 'Failed to export CSV' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addBatch,
  getBatches,
  exportProductsCSV,
};
