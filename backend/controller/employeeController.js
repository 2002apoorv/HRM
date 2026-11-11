const multer = require("multer");
const { Employee } = require("../models/Employee");
const { User } = require("../models/User");
const { Department } = require("../models/Department");
const bcrypt = require("bcrypt");
const path = require("path");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Add Employee Controller
const addEmployee = async (req, res) => {
  let savedUser = null;
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      role,
    } = req.body;

    const orgId = req.organizationId;

    if (!name || !email || !employeeId) {
      return res.status(400).json({
        success: false,
        error: "Full Name, Work Email, and Employee ID are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanEmpId = employeeId.trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      // Check if this existing user is an orphaned user without an employee record
      const existingEmp = await Employee.findOne({ userId: existingUser._id });
      if (existingEmp) {
        return res.status(400).json({ success: false, error: "A user is already registered with this email" });
      } else {
        // Automatically clean up the orphaned user from a previous failed attempt
        await User.findByIdAndDelete(existingUser._id);
      }
    }

    // Check if employeeId already exists in this tenant
    const existingEmployeeId = await Employee.findOne({
      organizationId: orgId,
      employeeId: cleanEmpId,
    });
    if (existingEmployeeId) {
      return res.status(400).json({ success: false, error: "Employee ID already exists in your organization" });
    }

    // Find department scoped to this tenant
    let departmentDoc = null;
    const deptStr = (department || "").toString().trim();
    if (deptStr.match(/^[0-9a-fA-F]{24}$/)) {
      departmentDoc = await Department.findOne({ _id: deptStr, organizationId: orgId });
    }
    if (!departmentDoc && deptStr) {
      departmentDoc = await Department.findOne({
        dep_name: { $regex: new RegExp(`^${deptStr}$`, "i") },
        organizationId: orgId,
      });
    }
    if (!departmentDoc) {
      // Fallback to first available department in tenant if user typed a custom label or first option
      departmentDoc = await Department.findOne({ organizationId: orgId });
    }

    if (!departmentDoc) {
      return res.status(400).json({
        success: false,
        error: "Please create at least one department first before onboarding employees.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password || "123456", 10);

    // Create new User
    const newUser = new User({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: (role && role.toLowerCase() === "admin") ? "admin" : "Employee",
      organizationId: orgId,
      profileImage: req.file ? req.file.filename : "",
    });

    savedUser = await newUser.save();

    // Safe numeric salary (defaults to 0 if not entered)
    const numericSalary = (salary !== undefined && salary !== null && salary !== "")
      ? Number(salary) || 0
      : 0;

    // Safe parsed date of birth
    let parsedDob = undefined;
    if (dob && !isNaN(new Date(dob).getTime())) {
      parsedDob = new Date(dob);
    }

    // Create new Employee scoped to organization
    const newEmployee = new Employee({
      organizationId: orgId,
      userId: savedUser._id,
      employeeId: cleanEmpId,
      dob: parsedDob,
      gender: gender || "Male",
      maritalStatus: maritalStatus || "Single",
      designation: designation ? designation.trim() : "Staff Member",
      department: departmentDoc._id,
      salary: numericSalary,
    });

    await newEmployee.save();

    return res.status(200).json({ success: true, msg: "Employee created successfully" });
  } catch (err) {
    console.error("Error creating employee:", err);
    // Atomic Rollback: remove saved user if employee creation failed
    if (savedUser && savedUser._id) {
      try {
        await User.findByIdAndDelete(savedUser._id);
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }
    }
    return res.status(500).json({
      success: false,
      error: err.message || "Employee creation failed",
    });
  }
};

const getEmployees = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const employees = await Employee.find({ organizationId: orgId })
      .populate("userId", { password: 0 })
      .populate("department");
    return res.status(200).json({ success: true, employees });
  } catch (err) {
    console.error("Get employees error:", err);
    return res.status(500).json({ success: false, error: "get employees server error" });
  }
};

const getEmployee = async (req, res) => {
  const { id } = req.params;
  const orgId = req.organizationId;
  try {
    let employee = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      employee = await Employee.findOne({ _id: id, organizationId: orgId })
        .populate("userId", { password: 0 })
        .populate("department");
      if (!employee) {
        employee = await Employee.findOne({ userId: id, organizationId: orgId })
          .populate("userId", { password: 0 })
          .populate("department");
      }
    }

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found in your organization" });
    }

    return res.status(200).json({ success: true, employee });
  } catch (err) {
    console.error("Get employee error:", err);
    return res.status(500).json({ success: false, error: "get employee server error" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.organizationId;
    const { name, maritalStatus, designation, department, salary } = req.body;

    // Step 1: Find employee scoped to this tenant
    const employee = await Employee.findOne({ _id: id, organizationId: orgId });
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found in your organization" });
    }

    // Step 2: Validate department belongs to same organization
    if (department) {
      const deptDoc = await Department.findOne({ _id: department, organizationId: orgId });
      if (!deptDoc) {
        return res.status(400).json({ success: false, error: "Invalid department for your organization" });
      }
    }

    // Step 3: Find associated user
    const user = await User.findOne({ _id: employee.userId, organizationId: orgId });
    if (user && name) {
      await User.findByIdAndUpdate(employee.userId, { name });
    }

    // Step 4: Update employee record
    await Employee.findByIdAndUpdate(id, {
      maritalStatus,
      designation,
      salary,
      department,
    });

    return res.status(200).json({ success: true, msg: "Employee updated" });
  } catch (error) {
    console.error("Update error:", error.message);
    return res.status(500).json({ success: false, error: "Update employee server error" });
  }
};

const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params;
  const orgId = req.organizationId;
  try {
    const employees = await Employee.find({ department: id, organizationId: orgId });
    return res.status(200).json({ success: true, employees });
  } catch (err) {
    console.error("Fetch employees by dep error:", err);
    return res.status(500).json({ success: false, error: "get employees by depId server error" });
  }
};

module.exports = {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepId,
};
