const { Employee } = require('../models/Employee');
const Salary = require('../models/Salary');

const addSalary = async (req, res) => {
  try {
    const { employeeId, basicSalary, allowances, deductions, payDate } = req.body;
    const orgId = req.organizationId;

    // Verify employee belongs to same organization
    const employee = await Employee.findOne({ _id: employeeId, organizationId: orgId });
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found in your organization' });
    }

    const totalSalary =
      parseInt(basicSalary || 0) + parseInt(allowances || 0) - parseInt(deductions || 0);

    const newSalary = new Salary({
      organizationId: orgId,
      employeeId,
      basicSalary,
      allowance: allowances || 0,
      deductions: deductions || 0,
      netSalary: totalSalary,
      payDate,
    });

    await newSalary.save();

    return res.status(200).json({ success: true, msg: 'Salary record added successfully' });
  } catch (error) {
    console.error('Salary add error:', error);
    return res.status(500).json({ success: false, error: 'Salary add server error' });
  }
};

const getSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.organizationId;

    // First find employee scoped to organization
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

    const salary = await Salary.find({
      employeeId: employee._id,
      organizationId: orgId,
    }).populate('employeeId', 'employeeId');

    return res.status(200).json({ success: true, salary });
  } catch (error) {
    console.error('Salary get error:', error);
    return res.status(500).json({ success: false, error: 'Salary get server error' });
  }
};

module.exports = { addSalary, getSalary };