const mongoose = require('mongoose');
const { Schema } = mongoose;

const leaveSchema = new Schema({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true,
  },
  leaveType: {
    type: String,
    enum: ['Sick Leave', 'Casual Leave', 'Annual Leave'],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

leaveSchema.index({ organizationId: 1, employeeId: 1 });

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;
