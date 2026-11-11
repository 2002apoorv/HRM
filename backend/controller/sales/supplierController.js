const { Supplier } = require('../../models/sales/Supplier');
const { PurchaseOrder } = require('../../models/sales/PurchaseOrder');
const { Payment } = require('../../models/sales/Payment');

const getSuppliers = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { search, page = 1, limit = 50 } = req.query;

    const query = { organizationId: orgId };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [suppliers, totalCount] = await Promise.all([
      Supplier.find(query).sort({ name: 1 }).skip(skip).limit(parseInt(limit)),
      Supplier.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      suppliers,
      totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
    });
  } catch (err) {
    console.error('Get suppliers error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch suppliers' });
  }
};

const createSupplier = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { name, contactPerson, phone, email, address } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Supplier name is required' });
    }

    const newSupplier = new Supplier({
      organizationId: orgId,
      name: name.trim(),
      contactPerson: contactPerson ? contactPerson.trim() : '',
      phone: phone ? phone.trim() : '',
      email: email ? email.trim().toLowerCase() : '',
      address: address ? address.trim() : '',
    });

    await newSupplier.save();

    return res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      supplier: newSupplier,
    });
  } catch (err) {
    console.error('Create supplier error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create supplier' });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.organizationId;

    const supplier = await Supplier.findOne({ _id: id, organizationId: orgId });
    if (!supplier) {
      return res.status(404).json({ success: false, error: 'Supplier not found in your organization' });
    }

    const [purchaseOrders, payments] = await Promise.all([
      PurchaseOrder.find({ supplierId: supplier._id, organizationId: orgId }).sort({ orderDate: -1 }).limit(20),
      Payment.find({ partyId: supplier._id, organizationId: orgId }).sort({ paymentDate: -1 }).limit(20),
    ]);

    return res.status(200).json({
      success: true,
      supplier,
      purchaseOrders,
      payments,
    });
  } catch (err) {
    console.error('Get supplier error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch supplier details' });
  }
};

const recordSupplierPayment = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { supplierId, amount, paymentMethod = 'BANK_TRANSFER', notes, purchaseOrderId } = req.body;

    if (!supplierId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: 'Valid supplier and payment amount are required' });
    }

    const supplier = await Supplier.findOne({ _id: supplierId, organizationId: orgId });
    if (!supplier) {
      return res.status(404).json({ success: false, error: 'Supplier not found in your organization' });
    }

    const amt = Number(amount);
    supplier.outstandingBalance = Math.max(0, supplier.outstandingBalance - amt);
    await supplier.save();

    if (purchaseOrderId) {
      const po = await PurchaseOrder.findOne({ _id: purchaseOrderId, organizationId: orgId });
      if (po) {
        po.paidAmount += amt;
        po.paymentStatus = po.paidAmount >= po.totalAmount ? 'PAID' : 'PARTIAL';
        await po.save();
      }
    }

    const paymentNumber = `PAY-SUP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const payment = new Payment({
      organizationId: orgId,
      paymentNumber,
      paymentType: 'SUPPLIER_PAYMENT',
      referenceType: purchaseOrderId ? 'PurchaseOrder' : 'Direct',
      referenceId: purchaseOrderId || null,
      partyId: supplier._id,
      partyName: supplier.name,
      amount: amt,
      paymentMethod,
      notes: notes || 'Supplier payment',
      processedBy: req.user._id,
    });

    await payment.save();

    return res.status(200).json({
      success: true,
      message: 'Supplier payment recorded successfully',
      payment,
      remainingBalance: supplier.outstandingBalance,
    });
  } catch (err) {
    console.error('Record supplier payment error:', err);
    return res.status(500).json({ success: false, error: 'Failed to record supplier payment' });
  }
};

module.exports = {
  getSuppliers,
  createSupplier,
  getSupplierById,
  recordSupplierPayment,
};
