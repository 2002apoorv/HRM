const { PurchaseOrder } = require('../../models/sales/PurchaseOrder');
const { Supplier } = require('../../models/sales/Supplier');
const { Product } = require('../../models/sales/Product');
const { ProductBatch } = require('../../models/sales/ProductBatch');
const { InventoryMovement } = require('../../models/sales/InventoryMovement');
const { Payment } = require('../../models/sales/Payment');

const createPurchaseOrder = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { supplierId, items, notes } = req.body;

    if (!supplierId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Supplier and items are required' });
    }

    const supplier = await Supplier.findOne({ _id: supplierId, organizationId: orgId });
    if (!supplier) {
      return res.status(404).json({ success: false, error: 'Supplier not found in your organization' });
    }

    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findOne({ _id: item.productId, organizationId: orgId });
      if (!product) {
        return res.status(404).json({ success: false, error: `Product not found: ${item.productId}` });
      }

      const qty = Number(item.quantity);
      const unitCost = Number(item.unitCost) || product.purchaseCost;
      const itemTotal = qty * unitCost;
      totalAmount += itemTotal;

      processedItems.push({
        productId: product._id,
        productName: product.name,
        batchNumber: item.batchNumber ? item.batchNumber.trim().toUpperCase() : '',
        expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
        quantity: qty,
        receivedQuantity: 0,
        unitCost,
        totalCost: itemTotal,
      });
    }

    const poNumber = `PO-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newPO = new PurchaseOrder({
      organizationId: orgId,
      poNumber,
      supplierId: supplier._id,
      items: processedItems,
      totalAmount,
      paidAmount: 0,
      paymentStatus: 'UNPAID',
      orderStatus: 'PENDING',
      notes: notes || '',
      createdBy: req.user._id,
    });

    await newPO.save();

    return res.status(201).json({
      success: true,
      message: 'Purchase order created successfully',
      purchaseOrder: newPO,
    });
  } catch (err) {
    console.error('Create PO error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create purchase order' });
  }
};

const getPurchaseOrders = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { status, page = 1, limit = 50 } = req.query;

    const query = { organizationId: orgId };
    if (status) query.orderStatus = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, totalCount] = await Promise.all([
      PurchaseOrder.find(query)
        .populate('supplierId', 'name contactPerson phone')
        .populate('createdBy', 'name email')
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      PurchaseOrder.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      purchaseOrders: orders,
      totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
    });
  } catch (err) {
    console.error('Get POs error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch purchase orders' });
  }
};

const receivePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.organizationId;
    const { receivedItems } = req.body;

    const po = await PurchaseOrder.findOne({ _id: id, organizationId: orgId });
    if (!po) {
      return res.status(404).json({ success: false, error: 'Purchase order not found in your organization' });
    }

    if (po.orderStatus === 'RECEIVED') {
      return res.status(400).json({ success: false, error: 'Purchase order is already received' });
    }

    // Process receiving for each item
    for (const item of po.items) {
      const receiveDetails = (receivedItems || []).find(
        r => r.productId.toString() === item.productId.toString()
      ) || {};

      const qtyToReceive = Number(receiveDetails.receivedQuantity) || item.quantity;
      const batchNum = receiveDetails.batchNumber || item.batchNumber;
      const expDate = receiveDetails.expiryDate || item.expiryDate;

      item.receivedQuantity = qtyToReceive;

      const product = await Product.findOne({ _id: item.productId, organizationId: orgId });
      if (product) {
        let createdBatch = null;
        if (product.hasBatches || batchNum) {
          const upperBatch = (batchNum || `BAT-${Date.now().toString().slice(-4)}`).toUpperCase();
          createdBatch = await ProductBatch.findOne({
            organizationId: orgId,
            productId: product._id,
            batchNumber: upperBatch,
          });

          if (createdBatch) {
            createdBatch.currentQuantity += qtyToReceive;
            createdBatch.initialQuantity += qtyToReceive;
            createdBatch.purchaseCost = item.unitCost;
            if (expDate) createdBatch.expiryDate = new Date(expDate);
            await createdBatch.save();
          } else {
            createdBatch = new ProductBatch({
              organizationId: orgId,
              productId: product._id,
              batchNumber: upperBatch,
              purchaseCost: item.unitCost,
              sellingPrice: product.sellingPrice,
              initialQuantity: qtyToReceive,
              currentQuantity: qtyToReceive,
              expiryDate: expDate ? new Date(expDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            });
            await createdBatch.save();
          }
          product.hasBatches = true;
        }

        const prevStock = product.currentStock;
        product.currentStock += qtyToReceive;
        product.purchaseCost = item.unitCost; // update latest cost
        await product.save();

        await InventoryMovement.create({
          organizationId: orgId,
          productId: product._id,
          batchId: createdBatch ? createdBatch._id : null,
          movementType: 'RECEIVE_PURCHASE',
          quantity: qtyToReceive,
          previousStock: prevStock,
          newStock: product.currentStock,
          referenceType: 'PurchaseOrder',
          referenceId: po._id,
          reason: `Goods receipt for ${po.poNumber}`,
          performedBy: req.user._id,
        });
      }
    }

    po.orderStatus = 'RECEIVED';
    po.receivedDate = new Date();
    await po.save();

    // Update supplier balance if unpaid
    const supplier = await Supplier.findOne({ _id: po.supplierId, organizationId: orgId });
    if (supplier) {
      supplier.outstandingBalance += Math.max(0, po.totalAmount - po.paidAmount);
      await supplier.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Goods received and inventory updated successfully',
      purchaseOrder: po,
    });
  } catch (err) {
    console.error('Receive PO error:', err);
    return res.status(500).json({ success: false, error: 'Failed to receive goods' });
  }
};

module.exports = {
  createPurchaseOrder,
  getPurchaseOrders,
  receivePurchaseOrder,
};
