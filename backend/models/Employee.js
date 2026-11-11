const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new mongoose.Schema({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String },
  maritalStatus: { type: String },
  designation: { type: String },
  department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  salary: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

employeeSchema.index({ organizationId: 1, employeeId: 1 }, { unique: true });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = { Employee };