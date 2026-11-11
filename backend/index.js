const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

const connectToDatabase = require('./db/db');
connectToDatabase();

// Auth Route
const authRouter = require('./routes/auth');

// HRM Routes
const departmentRouter = require('./routes/department');
const employeeRouter = require('./routes/employee');
const salaryRouter = require('./routes/salary');
const leaveRouter = require('./routes/leave');
const attendanceRouter = require('./routes/attendance');
const dashboardRouter = require('./routes/dashboard');

// Sales & Inventory Modular Route
const salesRouter = require('./routes/sales');

app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/sales', salesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});