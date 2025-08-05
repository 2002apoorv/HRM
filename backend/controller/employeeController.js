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
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department, // this is expected to be department name like "IT"
      salary,
      password,
      role,
    } = req.body;

    console.log("Received data:", req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User already registered" });
    }

    // Find department by name and get its ObjectId
    const departmentDoc = await Department.findOne({ dep_name: department });
    if (!departmentDoc) {
      return res.status(400).json({ success: false, error: "Invalid department name" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage: req.file ? req.file.filename : "",
    });

    const savedUser = await newUser.save();

    // Create new Employee with department ObjectId
    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department: departmentDoc._id,
      salary,
    });

    await newEmployee.save();

    return res.status(200).json({ success: true, msg: "Employee created successfully" });
  } catch (err) {
    console.log("Error creating employee:", err.message);
    return res.status(500).json({ success: false, error: "Employee creation failed" });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('userId',{password:0}).populate('department');
    console.log(employees)
    return res.status(200).json({ success: true, employees: employees })
  } catch (err) {
    return res.status(500).json({ success: false, error: "get employees server  error" })
  }
}

const getEmployee = async (req, res) => {
  const {id}=req.params;
  try {
    let employee = await Employee.findById({_id:id}).populate('userId',{password:0}).populate('department');
    if(!employee){
      employee=  await Employee.findOne({userId:id}).populate('userId',{password:0}).populate('department');
    }
    console.log(employee)
    
    return res.status(200).json({ success: true, employee: employee })
  } catch (err) {
    return res.status(500).json({ success: false, error: "get employees server  error" })
  }
}

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, maritalStatus, designation, department, salary } = req.body;

    // Step 1: Find the employee
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    // Step 2: Find the associated user
    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Step 3: Update the user name
    await User.findByIdAndUpdate(employee.userId, { name });

    // Step 4: Update the employee record
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

const fetchEmployeesByDepId=async(req,res)=>{
   const {id}=req.params;
  try {
    const employees = await Employee.find({department:id})
    return res.status(200).json({ success: true, employees: employees })
  } catch (err) {
    return res.status(500).json({ success: false, error: "get employeesbyDepId server  error" })
  }
}

module.exports = { addEmployee, upload,getEmployees,getEmployee ,updateEmployee,fetchEmployeesByDepId};
