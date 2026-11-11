const mongoose = require('mongoose');
const { Schema } = mongoose;

const purchaseOrderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  batchNumber: {
    type: String,
    trim: true,
    default: '',
  },
  expiryDate: {
    type: Date,
    default: null,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  receivedQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  unitCost: {
    type: Number,
    required: true,
    min: 0,
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0,
  },
});

const purchaseOrderSchema = new Schema({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  poNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  supplierId: {
    type: Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
  },
  items: [purchaseOrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  paymentStatus: {
    type: String,
    enum: ['UNPAID', 'PARTIAL', 'PAID'],
    default: 'UNPAID',
  },
  orderStatus: {
    type: String,
    enum: ['PENDING', 'RECEIVED', 'CANCELLED'],
    default: 'PENDING',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  receivedDate: {
    type: Date,
    default: null,
  },
  notes: {
    type: String,
    trim: true,
    default: '',
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

purchaseOrderSchema.index({ organizationId: 1, poNumber: 1 }, { unique: true });
purchaseOrderSchema.index({ organizationId: 1, orderDate: -1 });
purchaseOrderSchema.index({ organizationId: 1, supplierId: 1 });

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

module.exports = { PurchaseOrder };
