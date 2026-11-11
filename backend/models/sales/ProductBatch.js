const mongoose = require('mongoose');
const { Schema } = mongoose;

const productBatchSchema = new Schema({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  },
  batchNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  purchaseCost: {
    type: Number,
    required: true,
    min: 0,
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  initialQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  currentQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  receivedDate: {
    type: Date,
    default: Date.now,
  },
  isExpired: {
    type: Boolean,
    default: false,
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

productBatchSchema.index({ organizationId: 1, productId: 1, batchNumber: 1 }, { unique: true });
productBatchSchema.index({ organizationId: 1, expiryDate: 1 });
productBatchSchema.index({ organizationId: 1, currentQuantity: 1 });

const ProductBatch = mongoose.model('ProductBatch', productBatchSchema);

module.exports = { ProductBatch };
