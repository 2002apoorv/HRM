const mongoose = require('mongoose');
const { Schema } = mongoose;

const inventoryMovementSchema = new Schema({
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
  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'ProductBatch',
    default: null,
  },
  movementType: {
    type: String,
    enum: [
      'RECEIVE_PURCHASE',
      'SALE_DEDUCT',
      'RETURN_RESTORE',
      'MANUAL_ADJUSTMENT',
      'DAMAGE_WRITEOFF',
      'EXPIRED_WRITEOFF',
    ],
    required: true,
  },
  quantity: {
    type: Number,
    required: true, // positive for additions, negative for deductions
  },
  previousStock: {
    type: Number,
    required: true,
  },
  newStock: {
    type: Number,
    required: true,
  },
  referenceType: {
    type: String,
    enum: ['PurchaseOrder', 'SaleInvoice', 'Return', 'Manual'],
    default: 'Manual',
  },
  referenceId: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  reason: {
    type: String,
    trim: true,
    default: '',
  },
  performedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

inventoryMovementSchema.index({ organizationId: 1, productId: 1, timestamp: -1 });
inventoryMovementSchema.index({ organizationId: 1, movementType: 1 });

const InventoryMovement = mongoose.model('InventoryMovement', inventoryMovementSchema);

module.exports = { InventoryMovement };
