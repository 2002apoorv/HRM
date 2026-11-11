const mongoose = require('mongoose');
const { Schema } = mongoose;

const returnItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'ProductBatch',
    default: null,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  refundAmount: {
    type: Number,
    required: true,
  },
  condition: {
    type: String,
    enum: ['RESALABLE', 'DAMAGED'],
    default: 'RESALABLE',
  },
  stockRestored: {
    type: Boolean,
    default: false,
  },
});

const returnSchema = new Schema({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  returnNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  saleInvoiceId: {
    type: Schema.Types.ObjectId,
    ref: 'SaleInvoice',
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    default: null,
  },
  customerName: {
    type: String,
    default: 'Walk-in Customer',
  },
  items: [returnItemSchema],
  totalRefundAmount: {
    type: Number,
    required: true,
  },
  refundMethod: {
    type: String,
    enum: ['CASH', 'UPI', 'CREDIT_NOTE'],
    default: 'CASH',
  },
  reason: {
    type: String,
    trim: true,
    default: 'Customer return',
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

returnSchema.index({ organizationId: 1, returnNumber: 1 }, { unique: true });
returnSchema.index({ organizationId: 1, saleInvoiceId: 1 });
returnSchema.index({ organizationId: 1, createdAt: -1 });

const Return = mongoose.model('Return', returnSchema);

module.exports = { Return };
