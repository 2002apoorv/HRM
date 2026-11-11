const { Employee } = require('../models/Employee');
const Leave = require('../models/Leave');

const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;
    const orgId = req.organizationId;

    let employee = await Employee.findOne({ userId, organizationId: orgId });
    if (!employee && userId.match(/^[0-9a-fA-F]{24}$/)) {
      employee = await Employee.findOne({ _id: userId, organizationId: orgId });
    }

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found in your organization' });
    }

    const newLeave = new Leave({
      organizationId: orgId,
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();

    return res.status(200).json({ success: true, msg: 'Leave application submitted successfully' });
  } catch (error) {
    console.error('Leave add error:', error);
    return res.status(500).json({ success: false, error: 'Leave add server error' });
  }
};

const getLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.organizationId;

    let employee = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      employee = await Employee.findOne({ _id: id, organizationId: orgId });
      if (!employee) {
        employee = await Employee.findOne({ userId: id, organizationId: orgId });
      }
    }

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found in your organization' });
    }

    const leaves = await Leave.find({
      employeeId: employee._id,
      organizationId: orgId,
    });

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error('Leave get error:', error);
    return res.status(500).json({ success: false, error: 'Leave get server error' });
  }
};

const getLeaves = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const leaves = await Leave.find({ organizationId: orgId }).populate({
      path: 'employeeId',
      populate: [
        {
          path: 'department',
          select: 'dep_name',
        },
        {
          path: 'userId',
          select: 'name email',
        },
      ],
    });
    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error('Get leaves error:', error);
    return res.status(500).json({ success: false, error: 'Leave get server error' });
  }
};

const getLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.organizationId;

    const leave = await Leave.findOne({ _id: id, organizationId: orgId }).populate({
      path: 'employeeId',
      populate: [
        {
          path: 'department',
          select: 'dep_name',
        },
        {
          path: 'userId',
          select: 'name profileImage email',
        },
      ],
    });

    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave record not found in your organization' });
    }

    return res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error('Leave detail error:', error);
    return res.status(500).json({ success: false, error: 'Leave get server error' });
  }
};

const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.organizationId;

    const leave = await Leave.findOneAndUpdate(
      { _id: id, organizationId: orgId },
      { status: req.body.status, updatedAt: new Date() },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({
        success: false,
        error: 'Leave not found in your organization',
      });
    }

    return res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error('Update leave error:', error);
    return res.status(500).json({ success: false, error: 'Leave update server error' });
  }
};

module.exports = { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave };