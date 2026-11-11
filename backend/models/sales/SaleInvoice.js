const mongoose = require('mongoose');
const { Schema } = mongoose;

const saleInvoiceItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'ProductBatch',
    default: null,
  },
  batchNumber: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  returnedQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  unitCost: {
    type: Number,
    default: 0,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  taxRate: {
    type: Number,
    default: 0,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const saleInvoiceSchema = new Schema({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    default: null,
  },
  customerName: {
    type: String,
    default: 'Walk-in Customer',
    trim: true,
  },
  customerPhone: {
    type: String,
    default: '',
    trim: true,
  },
  items: [saleInvoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    required: true,
  },
  balanceDue: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'UPI', 'CARD', 'BANK_TRANSFER'],
    default: 'CASH',
  },
  paymentStatus: {
    type: String,
    enum: ['PAID', 'PARTIAL', 'UNPAID'],
    default: 'PAID',
  },
  returnStatus: {
    type: String,
    enum: ['NONE', 'PARTIAL', 'FULL'],
    default: 'NONE',
  },
  notes: {
    type: String,
    default: '',
    trim: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

saleInvoiceSchema.index({ organizationId: 1, invoiceNumber: 1 }, { unique: true });
saleInvoiceSchema.index({ organizationId: 1, createdAt: -1 });
saleInvoiceSchema.index({ organizationId: 1, customerId: 1 });

const SaleInvoice = mongoose.model('SaleInvoice', saleInvoiceSchema);

module.exports = { SaleInvoice };
