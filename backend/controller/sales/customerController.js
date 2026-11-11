const { Customer } = require('../../models/sales/Customer');
const { SaleInvoice } = require('../../models/sales/SaleInvoice');
const { Payment } = require('../../models/sales/Payment');

const getCustomers = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { search, page = 1, limit = 50 } = req.query;

    const query = { organizationId: orgId };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [customers, totalCount] = await Promise.all([
      Customer.find(query).sort({ name: 1 }).skip(skip).limit(parseInt(limit)),
      Customer.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      customers,
      totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
    });
  } catch (err) {
    console.error('Get customers error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch customers' });
  }
};

const createCustomer = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { name, phone, email, address } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Customer name is required' });
    }

    const newCustomer = new Customer({
      organizationId: orgId,
      name: name.trim(),
      phone: phone ? phone.trim() : '',
      email: email ? email.trim().toLowerCase() : '',
      address: address ? address.trim() : '',
    });

    await newCustomer.save();

    return res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      customer: newCustomer,
    });
  } catch (err) {
    console.error('Create customer error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create customer' });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.organizationId;

    const customer = await Customer.findOne({ _id: id, organizationId: orgId });
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found in your organization' });
    }

    const [invoices, payments] = await Promise.all([
      SaleInvoice.find({ customerId: customer._id, organizationId: orgId }).sort({ createdAt: -1 }).limit(20),
      Payment.find({ partyId: customer._id, organizationId: orgId }).sort({ paymentDate: -1 }).limit(20),
    ]);

    return res.status(200).json({
      success: true,
      customer,
      invoices,
      payments,
    });
  } catch (err) {
    console.error('Get customer details error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch customer details' });
  }
};

const recordCustomerPayment = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { customerId, amount, paymentMethod = 'CASH', notes, referenceInvoiceId } = req.body;

    if (!customerId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: 'Valid customer and payment amount are required' });
    }

    const customer = await Customer.findOne({ _id: customerId, organizationId: orgId });
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found in your organization' });
    }

    const amt = Number(amount);
    customer.outstandingBalance = Math.max(0, customer.outstandingBalance - amt);
    await customer.save();

    // If linked to an invoice, update invoice paid amount
    if (referenceInvoiceId) {
      const invoice = await SaleInvoice.findOne({ _id: referenceInvoiceId, organizationId: orgId });
      if (invoice) {
        invoice.paidAmount += amt;
        invoice.balanceDue = Math.max(0, invoice.totalAmount - invoice.paidAmount);
        invoice.paymentStatus = invoice.balanceDue === 0 ? 'PAID' : 'PARTIAL';
        await invoice.save();
      }
    }

    const paymentNumber = `PAY-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const payment = new Payment({
      organizationId: orgId,
      paymentNumber,
      paymentType: 'CUSTOMER_PAYMENT',
      referenceType: referenceInvoiceId ? 'SaleInvoice' : 'Direct',
      referenceId: referenceInvoiceId || null,
      partyId: customer._id,
      partyName: customer.name,
      amount: amt,
      paymentMethod,
      notes: notes || 'Customer outstanding balance payment',
      processedBy: req.user._id,
    });

    await payment.save();

    return res.status(200).json({
      success: true,
      message: 'Payment recorded successfully',
      payment,
      remainingBalance: customer.outstandingBalance,
    });
  } catch (err) {
    console.error('Record customer payment error:', err);
    return res.status(500).json({ success: false, error: 'Failed to record customer payment' });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  getCustomerById,
  recordCustomerPayment,
};
