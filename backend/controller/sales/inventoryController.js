const { InventoryMovement } = require('../../models/sales/InventoryMovement');
const { Product } = require('../../models/sales/Product');
const { ProductBatch } = require('../../models/sales/ProductBatch');

const getMovements = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { productId, movementType, page = 1, limit = 50 } = req.query;

    const query = { organizationId: orgId };
    if (productId) query.productId = productId;
    if (movementType) query.movementType = movementType;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [movements, totalCount] = await Promise.all([
      InventoryMovement.find(query)
        .populate('productId', 'name sku unit')
        .populate('batchId', 'batchNumber expiryDate')
        .populate('performedBy', 'name email')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      InventoryMovement.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      movements,
      totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
    });
  } catch (err) {
    console.error('Get movements error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch inventory movements' });
  }
};

const adjustStock = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { productId, batchId, quantityChange, reason } = req.body;

    if (!productId || quantityChange === undefined || !reason) {
      return res.status(400).json({
        success: false,
        error: 'Product, quantityChange, and reason are required',
      });
    }

    const qtyChangeNum = Number(quantityChange);
    if (isNaN(qtyChangeNum) || qtyChangeNum === 0) {
      return res.status(400).json({ success: false, error: 'Valid non-zero quantity change is required' });
    }

    const product = await Product.findOne({ _id: productId, organizationId: orgId });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found in your organization' });
    }

    const prevStock = product.currentStock;
    const newStock = prevStock + qtyChangeNum;

    if (newStock < 0) {
      return res.status(400).json({
        success: false,
        error: `Adjustment would result in negative stock (${newStock})`,
      });
    }

    // If batch specified
    let batchDoc = null;
    if (batchId) {
      batchDoc = await ProductBatch.findOne({ _id: batchId, organizationId: orgId, productId: product._id });
      if (!batchDoc) {
        return res.status(404).json({ success: false, error: 'Batch not found' });
      }
      if (batchDoc.currentQuantity + qtyChangeNum < 0) {
        return res.status(400).json({
          success: false,
          error: `Batch stock cannot be negative (current: ${batchDoc.currentQuantity})`,
        });
      }
      batchDoc.currentQuantity += qtyChangeNum;
      await batchDoc.save();
    }

    product.currentStock = newStock;
    await product.save();

    const movement = await InventoryMovement.create({
      organizationId: orgId,
      productId: product._id,
      batchId: batchDoc ? batchDoc._id : null,
      movementType: 'MANUAL_ADJUSTMENT',
      quantity: qtyChangeNum,
      previousStock: prevStock,
      newStock: newStock,
      reason: reason.trim(),
      performedBy: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: 'Stock adjusted successfully',
      currentStock: newStock,
      movement,
    });
  } catch (err) {
    console.error('Adjust stock error:', err);
    return res.status(500).json({ success: false, error: 'Failed to adjust stock' });
  }
};

const writeOffStock = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { productId, batchId, quantity, type, reason } = req.body;

    if (!productId || !quantity || !type || !reason) {
      return res.status(400).json({
        success: false,
        error: 'Product, quantity, write-off type, and reason are required',
      });
    }

    const qtyNum = Math.abs(Number(quantity));
    const movementType = type === 'EXPIRED' ? 'EXPIRED_WRITEOFF' : 'DAMAGE_WRITEOFF';

    const product = await Product.findOne({ _id: productId, organizationId: orgId });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    if (product.currentStock < qtyNum) {
      return res.status(400).json({
        success: false,
        error: `Cannot write off more than available stock (${product.currentStock})`,
      });
    }

    let batchDoc = null;
    if (batchId) {
      batchDoc = await ProductBatch.findOne({ _id: batchId, organizationId: orgId, productId: product._id });
      if (batchDoc) {
        if (batchDoc.currentQuantity < qtyNum) {
          return res.status(400).json({
            success: false,
            error: `Batch available quantity is only ${batchDoc.currentQuantity}`,
          });
        }
        batchDoc.currentQuantity -= qtyNum;
        if (movementType === 'EXPIRED_WRITEOFF') {
          batchDoc.isExpired = true;
        }
        await batchDoc.save();
      }
    }

    const prevStock = product.currentStock;
    product.currentStock -= qtyNum;
    await product.save();

    const movement = await InventoryMovement.create({
      organizationId: orgId,
      productId: product._id,
      batchId: batchDoc ? batchDoc._id : null,
      movementType,
      quantity: -qtyNum,
      previousStock: prevStock,
      newStock: product.currentStock,
      reason: reason.trim(),
      performedBy: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: 'Stock write-off processed successfully',
      movement,
      currentStock: product.currentStock,
    });
  } catch (err) {
    console.error('Write off stock error:', err);
    return res.status(500).json({ success: false, error: 'Failed to write off stock' });
  }
};

const getAlerts = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const [lowStock, outOfStock, expiringBatches] = await Promise.all([
      Product.find({
        organizationId: orgId,
        status: 'active',
        currentStock: { $gt: 0 },
        $expr: { $lte: ['$currentStock', '$reorderThreshold'] },
      }).limit(20),
      Product.find({
        organizationId: orgId,
        status: 'active',
        currentStock: { $lte: 0 },
      }).limit(20),
      ProductBatch.find({
        organizationId: orgId,
        currentQuantity: { $gt: 0 },
        expiryDate: { $lte: thirtyDaysFromNow },
      })
        .populate('productId', 'name sku unit')
        .sort({ expiryDate: 1 })
        .limit(20),
    ]);

    return res.status(200).json({
      success: true,
      lowStock,
      outOfStock,
      expiringBatches,
    });
  } catch (err) {
    console.error('Get alerts error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch inventory alerts' });
  }
};

module.exports = {
  getMovements,
  adjustStock,
  writeOffStock,
  getAlerts,
};
