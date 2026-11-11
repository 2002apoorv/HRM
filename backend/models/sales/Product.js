const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sku: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  barcode: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    default: 'General',
  },
  description: {
    type: String,
    trim: true,
  },
  purchaseCost: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  reorderThreshold: {
    type: Number,
    default: 10,
    min: 0,
  },
  unit: {
    type: String,
    default: 'pcs',
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  hasBatches: {
    type: Boolean,
    default: false, // For medicines/perishables with batch & expiry
  },
  currentStock: {
    type: Number,
    default: 0,
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

// Enforce tenant uniqueness for SKU
productSchema.index({ organizationId: 1, sku: 1 }, { unique: true });
productSchema.index({ organizationId: 1, name: 1 });
productSchema.index({ organizationId: 1, barcode: 1 });
productSchema.index({ organizationId: 1, status: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };
