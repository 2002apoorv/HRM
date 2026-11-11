const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
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
  totalSpent: {
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

customerSchema.index({ organizationId: 1, phone: 1 });
customerSchema.index({ organizationId: 1, name: 1 });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = { Customer };
