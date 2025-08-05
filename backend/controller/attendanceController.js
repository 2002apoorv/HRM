const Attendance = require('../models/Attendance');
const { Employee } = require('../models/Employee');

const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate({
        path: 'employeeId',
        populate: [
          { path: 'userId', model: 'User' },            // to get employee name
          { path: 'department', model: 'Department' }   // to get department name
        ]
      });

    const formatted = attendance.map(record => {
      const employee = record.employeeId;
      const name = employee?.userId?.name || "N/A";
      const department = employee?.department?.name || "N/A";

      console.log("Fetched employees with populated data:", employee);


      return {
        _id: record._id,
        date: record.date,
        status: record.status,
        name,
        department,
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = { getAttendance };
