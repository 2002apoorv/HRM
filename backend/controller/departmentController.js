const { Department } = require("../models/Department");

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;

    if (!dep_name) {
      return res.status(400).json({ success: false, error: "Department name is required" });
    }

    // Check duplicate in same tenant
    const existing = await Department.findOne({
      organizationId: req.organizationId,
      dep_name: dep_name.trim(),
    });

    if (existing) {
      return res.status(400).json({ success: false, error: "Department name already exists in your organization" });
    }

    const newDep = new Department({
      organizationId: req.organizationId,
      dep_name: dep_name.trim(),
      description,
    });
    await newDep.save();

    return res.status(200).json({
      success: true,
      department: newDep,
      msg: "The department has been added",
    });
  } catch (err) {
    console.error("Add department error:", err);
    return res.status(500).json({ success: false, error: "add department server error" });
  }
};

const getDepartment = async (req, res) => {
  try {
    const departments = await Department.find({ organizationId: req.organizationId });
    return res.status(200).json({ success: true, departments });
  } catch (err) {
    console.error("Get department error:", err);
    return res.status(500).json({ success: false, error: "get department server error" });
  }
};

module.exports = { addDepartment, getDepartment };