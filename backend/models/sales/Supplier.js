const mongoose = require('mongoose');
const { Schema } = mongoose;

const supplierSchema = new Schema({
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
  contactPerson: {
    type: String,
    trim: true,
    default: '',
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  address: {
    type: String,
    trim: true,
    default: '',
  },
  outstandingBalance: {
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

supplierSchema.index({ organizationId: 1, name: 1 });

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = { Supplier };
