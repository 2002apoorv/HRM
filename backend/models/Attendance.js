const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema({
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
  },
  date: {
    type: String, // format YYYY-MM-DD
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Leave', null],
    default: null,
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

attendanceSchema.index({ organizationId: 1, employeeId: 1, date: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema, 'attendances');

module.exports = { Attendance };
