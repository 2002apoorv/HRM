const { SaleInvoice } = require('../../models/sales/SaleInvoice');
const { Product } = require('../../models/sales/Product');
const { ProductBatch } = require('../../models/sales/ProductBatch');
const { InventoryMovement } = require('../../models/sales/InventoryMovement');
const { Customer } = require('../../models/sales/Customer');
const { Payment } = require('../../models/sales/Payment');

const searchPosProducts = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { query } = req.query;

    const filter = { organizationId: orgId, status: 'active' };
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { sku: { $regex: query, $options: 'i' } },
        { barcode: { $regex: query, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter).sort({ name: 1 }).limit(30);

    // Attach eligible batches for pharmacy items
    const now = new Date();
    const productList = await Promise.all(
      products.map(async p => {
        let batches = [];
        if (p.hasBatches) {
          batches = await ProductBatch.find({
            organizationId: orgId,
            productId: p._id,
            currentQuantity: { $gt: 0 },
            expiryDate: { $gt: now }, // exclude expired batches
          }).sort({ expiryDate: 1 }); // earliest expiry first
        }
        return {
          ...p.toObject(),
          eligibleBatches: batches,
        };
      })
    );

    return res.status(200).json({ success: true, products: productList });
  } catch (err) {
    console.error('POS product search error:', err);
    return res.status(500).json({ success: false, error: 'Product search failed' });
  }
};

const createSale = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const {
      customerId,
      customerName,
      customerPhone,
      cartItems,
      discountAmount = 0,
      taxPercent = 0,
      paidAmount = 0,
      paymentMethod = 'CASH',
      notes,
    } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart cannot be empty' });
    }

    const now = new Date();
    const processedItems = [];
    const stockUpdates = [];
    const movementRecords = [];

    let calculatedSubtotal = 0;

    for (const item of cartItems) {
      const product = await Product.findOne({ _id: item.productId, organizationId: orgId });
      if (!product) {
        return res.status(404).json({ success: false, error: `Product not found: ${item.name || item.productId}` });
      }

      if (product.status !== 'active') {
        return res.status(400).json({ success: false, error: `Product ${product.name} is currently inactive` });
      }

      const reqQty = Number(item.quantity);
      if (reqQty <= 0) {
        return res.status(400).json({ success: false, error: `Invalid quantity for ${product.name}` });
      }

      const unitPrice = Number(item.unitPrice) || product.sellingPrice;
      const unitCost = product.purchaseCost;
      const itemDiscount = Number(item.discount) || 0;

      if (product.hasBatches) {
        // Earliest Expiry First allocation
        const availableBatches = await ProductBatch.find({
          organizationId: orgId,
          productId: product._id,
          currentQuantity: { $gt: 0 },
          expiryDate: { $gt: now }, // reject expired
        }).sort({ expiryDate: 1 });

        const totalBatchQty = availableBatches.reduce((acc, b) => acc + b.currentQuantity, 0);
        if (totalBatchQty < reqQty) {
          return res.status(400).json({
            success: false,
            error: `Insufficient unexpired batch stock for ${product.name}. Available: ${totalBatchQty}, Requested: ${reqQty}`,
          });
        }

        // Allocate across batches if needed
        let remainingToAllocate = reqQty;
        for (const batch of availableBatches) {
          if (remainingToAllocate <= 0) break;
          const allocQty = Math.min(batch.currentQuantity, remainingToAllocate);

          batch.currentQuantity -= allocQty;
          stockUpdates.push({ type: 'batch', doc: batch });

          const lineSub = unitPrice * allocQty - itemDiscount * (allocQty / reqQty);
          calculatedSubtotal += lineSub;

          processedItems.push({
            productId: product._id,
            batchId: batch._id,
            batchNumber: batch.batchNumber,
            name: product.name,
            sku: product.sku,
            quantity: allocQty,
            returnedQuantity: 0,
            unitPrice,
            unitCost: batch.purchaseCost || unitCost,
            discount: itemDiscount * (allocQty / reqQty),
            taxRate: Number(taxPercent) || 0,
            subtotal: lineSub,
            total: lineSub,
          });

          movementRecords.push({
            organizationId: orgId,
            productId: product._id,
            batchId: batch._id,
            movementType: 'SALE_DEDUCT',
            quantity: -allocQty,
            previousStock: product.currentStock,
            newStock: product.currentStock - allocQty,
            reason: `POS Sale - Batch ${batch.batchNumber}`,
            performedBy: req.user._id,
          });

          remainingToAllocate -= allocQty;
        }

        product.currentStock -= reqQty;
        stockUpdates.push({ type: 'product', doc: product });
      } else {
        // Standard item without batches
        if (product.currentStock < reqQty) {
          return res.status(400).json({
            success: false,
            error: `Insufficient stock for ${product.name}. Available: ${product.currentStock}, Requested: ${reqQty}`,
          });
        }

        const prevStock = product.currentStock;
        product.currentStock -= reqQty;
        stockUpdates.push({ type: 'product', doc: product });

        const lineSub = unitPrice * reqQty - itemDiscount;
        calculatedSubtotal += lineSub;

        processedItems.push({
          productId: product._id,
          batchId: null,
          batchNumber: '',
          name: product.name,
          sku: product.sku,
          quantity: reqQty,
          returnedQuantity: 0,
          unitPrice,
          unitCost,
          discount: itemDiscount,
          taxRate: Number(taxPercent) || 0,
          subtotal: lineSub,
          total: lineSub,
        });

        movementRecords.push({
          organizationId: orgId,
          productId: product._id,
          batchId: null,
          movementType: 'SALE_DEDUCT',
          quantity: -reqQty,
          previousStock: prevStock,
          newStock: product.currentStock,
          reason: 'POS Sale',
          performedBy: req.user._id,
        });
      }
    }

    const finalDiscount = Number(discountAmount) || 0;
    const taxableAmount = Math.max(0, calculatedSubtotal - finalDiscount);
    const calculatedTax = (taxableAmount * (Number(taxPercent) || 0)) / 100;
    const grandTotal = Math.round((taxableAmount + calculatedTax) * 100) / 100;

    const actualPaid = Number(paidAmount);
    const balanceDue = Math.max(0, Math.round((grandTotal - actualPaid) * 100) / 100);
    const paymentStatus = actualPaid >= grandTotal ? 'PAID' : actualPaid > 0 ? 'PARTIAL' : 'UNPAID';

    // Unique invoice number
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const invoiceNumber = `INV-${timestamp}-${randomSuffix}`;

    // Execute stock saves
    for (const update of stockUpdates) {
      await update.doc.save();
    }

    // Save invoice
    const newInvoice = new SaleInvoice({
      organizationId: orgId,
      invoiceNumber,
      customerId: customerId || null,
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '',
      items: processedItems,
      subtotal: calculatedSubtotal,
      discountAmount: finalDiscount,
      taxAmount: calculatedTax,
      totalAmount: grandTotal,
      paidAmount: actualPaid,
      balanceDue,
      paymentMethod,
      paymentStatus,
      returnStatus: 'NONE',
      notes: notes || '',
      createdBy: req.user._id,
    });
    await newInvoice.save();

    // Link reference to inventory movements
    for (const mov of movementRecords) {
      mov.referenceType = 'SaleInvoice';
      mov.referenceId = newInvoice._id;
      await InventoryMovement.create(mov);
    }

    // Record payment entry if paidAmount > 0
    let paymentDoc = null;
    if (actualPaid > 0) {
      paymentDoc = new Payment({
        organizationId: orgId,
        paymentNumber: `PAY-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
        paymentType: 'CUSTOMER_PAYMENT',
        referenceType: 'SaleInvoice',
        referenceId: newInvoice._id,
        partyId: customerId || null,
        partyName: customerName || 'Walk-in Customer',
        amount: actualPaid,
        paymentMethod,
        notes: `Payment for Invoice ${invoiceNumber}`,
        processedBy: req.user._id,
      });
      await paymentDoc.save();
    }

    // If customer selected, update balances
    if (customerId) {
      const customer = await Customer.findOne({ _id: customerId, organizationId: orgId });
      if (customer) {
        customer.totalSpent += grandTotal;
        customer.outstandingBalance += balanceDue;
        await customer.save();
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Sale completed successfully',
      invoice: newInvoice,
      payment: paymentDoc,
    });
  } catch (err) {
    console.error('Create sale error:', err);
    return res.status(500).json({ success: false, error: 'Checkout failed' });
  }
};

const getInvoices = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { search, paymentStatus, page = 1, limit = 50 } = req.query;

    const query = { organizationId: orgId };
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
      ];
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [invoices, totalCount] = await Promise.all([
      SaleInvoice.find(query)
        .populate('customerId', 'name phone email')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      SaleInvoice.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      invoices,
      totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
    });
  } catch (err) {
    console.error('Get invoices error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch invoices' });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.organizationId;

    const invoice = await SaleInvoice.findOne({ _id: id, organizationId: orgId })
      .populate('customerId', 'name phone email address')
      .populate('createdBy', 'name email');

    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found in your organization' });
    }

    const payments = await Payment.find({ referenceId: invoice._id, organizationId: orgId });

    return res.status(200).json({ success: true, invoice, payments });
  } catch (err) {
    console.error('Get invoice by ID error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch invoice details' });
  }
};

module.exports = {
  searchPosProducts,
  createSale,
  getInvoices,
  getInvoiceById,
};
