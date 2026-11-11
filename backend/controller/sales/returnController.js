const { Return } = require('../../models/sales/Return');
const { SaleInvoice } = require('../../models/sales/SaleInvoice');
const { Product } = require('../../models/sales/Product');
const { ProductBatch } = require('../../models/sales/ProductBatch');
const { InventoryMovement } = require('../../models/sales/InventoryMovement');
const { Customer } = require('../../models/sales/Customer');

const processReturn = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { saleInvoiceId, returnItems, refundMethod = 'CASH', reason } = req.body;

    if (!saleInvoiceId || !returnItems || !Array.isArray(returnItems) || returnItems.length === 0) {
      return res.status(400).json({ success: false, error: 'Invoice and return items are required' });
    }

    const invoice = await SaleInvoice.findOne({ _id: saleInvoiceId, organizationId: orgId });
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found in your organization' });
    }

    let calculatedRefund = 0;
    const processedReturnItems = [];

    for (const item of returnItems) {
      const origItem = invoice.items.find(
        i => i.productId.toString() === item.productId && (!item.batchId || (i.batchId && i.batchId.toString() === item.batchId))
      );

      if (!origItem) {
        return res.status(400).json({ success: false, error: `Item ${item.productName || item.productId} was not part of this invoice` });
      }

      const returnQty = Number(item.quantity);
      const availableToReturn = origItem.quantity - (origItem.returnedQuantity || 0);

      if (returnQty <= 0 || returnQty > availableToReturn) {
        return res.status(400).json({
          success: false,
          error: `Cannot return ${returnQty} of ${origItem.name}. Maximum returnable is ${availableToReturn}`,
        });
      }

      const itemRefund = returnQty * origItem.unitPrice;
      calculatedRefund += itemRefund;

      origItem.returnedQuantity = (origItem.returnedQuantity || 0) + returnQty;

      const shouldRestoreStock = item.condition === 'RESALABLE';

      // Restore stock if eligible
      if (shouldRestoreStock) {
        const product = await Product.findOne({ _id: origItem.productId, organizationId: orgId });
        if (product) {
          const prevStock = product.currentStock;
          product.currentStock += returnQty;
          await product.save();

          let batchDoc = null;
          if (origItem.batchId) {
            batchDoc = await ProductBatch.findOne({ _id: origItem.batchId, organizationId: orgId });
            if (batchDoc) {
              batchDoc.currentQuantity += returnQty;
              await batchDoc.save();
            }
          }

          await InventoryMovement.create({
            organizationId: orgId,
            productId: product._id,
            batchId: batchDoc ? batchDoc._id : null,
            movementType: 'RETURN_RESTORE',
            quantity: returnQty,
            previousStock: prevStock,
            newStock: product.currentStock,
            reason: `Return for invoice ${invoice.invoiceNumber}: ${reason || 'Customer return'}`,
            performedBy: req.user._id,
          });
        }
      }

      processedReturnItems.push({
        productId: origItem.productId,
        productName: origItem.name,
        batchId: origItem.batchId,
        quantity: returnQty,
        unitPrice: origItem.unitPrice,
        refundAmount: itemRefund,
        condition: item.condition || 'RESALABLE',
        stockRestored: shouldRestoreStock,
      });
    }

    // Check if fully returned or partially returned
    const totalSoldQty = invoice.items.reduce((acc, i) => acc + i.quantity, 0);
    const totalReturnedQty = invoice.items.reduce((acc, i) => acc + (i.returnedQuantity || 0), 0);
    invoice.returnStatus = totalReturnedQty >= totalSoldQty ? 'FULL' : 'PARTIAL';
    await invoice.save();

    const returnNumber = `RET-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const returnDoc = new Return({
      organizationId: orgId,
      returnNumber,
      saleInvoiceId: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      customerId: invoice.customerId,
      customerName: invoice.customerName,
      items: processedReturnItems,
      totalRefundAmount: calculatedRefund,
      refundMethod,
      reason: reason || 'Customer return',
      processedBy: req.user._id,
    });
    await returnDoc.save();

    // Adjust customer metrics if registered customer
    if (invoice.customerId) {
      const customer = await Customer.findOne({ _id: invoice.customerId, organizationId: orgId });
      if (customer) {
        customer.totalSpent = Math.max(0, customer.totalSpent - calculatedRefund);
        await customer.save();
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Return processed successfully',
      returnRecord: returnDoc,
      returnStatus: invoice.returnStatus,
    });
  } catch (err) {
    console.error('Process return error:', err);
    return res.status(500).json({ success: false, error: 'Failed to process return' });
  }
};

const getReturns = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [returns, totalCount] = await Promise.all([
      Return.find({ organizationId: orgId })
        .populate('processedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Return.countDocuments({ organizationId: orgId }),
    ]);

    return res.status(200).json({
      success: true,
      returns,
      totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
    });
  } catch (err) {
    console.error('Get returns error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch returns' });
  }
};

module.exports = {
  processReturn,
  getReturns,
};
