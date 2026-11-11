const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  paymentNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  paymentType: {
    type: String,
    enum: ['CUSTOMER_PAYMENT', 'SUPPLIER_PAYMENT'],
    required: true,
  },
  referenceType: {
    type: String,
    enum: ['SaleInvoice', 'PurchaseOrder', 'Direct'],
    default: 'SaleInvoice',
  },
  referenceId: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  partyId: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  partyName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01,
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'UPI', 'CARD', 'BANK_TRANSFER'],
    default: 'CASH',
  },
  transactionReference: {
    type: String,
    trim: true,
    default: '',
  },
  notes: {
    type: String,
    trim: true,
    default: '',
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  processedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

paymentSchema.index({ organizationId: 1, paymentNumber: 1 }, { unique: true });
paymentSchema.index({ organizationId: 1, paymentDate: -1 });
paymentSchema.index({ organizationId: 1, partyId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment };
