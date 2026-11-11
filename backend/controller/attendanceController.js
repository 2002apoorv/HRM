const { Attendance } = require('../models/Attendance');
const { Employee } = require('../models/Employee');

const getAttendance = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { date } = req.query;

    const query = { organizationId: orgId };
    if (date) {
      query.date = date;
    }

    const attendances = await Attendance.find(query)
      .populate({
        path: 'employeeId',
        populate: [
          { path: 'userId', select: 'name email profileImage' },
          { path: 'department', select: 'dep_name' },
        ],
      })
      .sort({ date: -1 });

    return res.status(200).json({ success: true, attendances });
  } catch (error) {
    console.error('Get attendance error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch attendance' });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date) {
      return res.status(400).json({ success: false, error: 'Employee ID and date are required' });
    }

    // Verify employee belongs to tenant
    const employee = await Employee.findOne({ _id: employeeId, organizationId: orgId });
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found in your organization' });
    }

    const record = await Attendance.findOneAndUpdate(
      { organizationId: orgId, employeeId, date },
      { status, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return res.status(200).json({ success: true, record });
  } catch (error) {
    console.error('Update attendance error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update attendance' });
  }
};

module.exports = { getAttendance, updateAttendance };
