const { Employee } = require('../models/Employee');
const { Department } = require('../models/Department');
const Leave = require('../models/Leave');

const getHrmSummary = async (req, res) => {
  try {
    const orgId = req.organizationId;

    const [totalEmployees, totalDepartments, pendingLeaves, recentEmployees] = await Promise.all([
      Employee.countDocuments({ organizationId: orgId }),
      Department.countDocuments({ organizationId: orgId }),
      Leave.countDocuments({ organizationId: orgId, status: 'Pending' }),
      Employee.find({ organizationId: orgId })
        .populate('userId', 'name email')
        .populate('department', 'dep_name')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    return res.status(200).json({
      success: true,
      totalEmployees,
      totalDepartments,
      pendingLeaves,
      recentEmployees,
    });
  } catch (err) {
    console.error('HRM summary error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch HRM summary' });
  }
};

module.exports = { getHrmSummary };
