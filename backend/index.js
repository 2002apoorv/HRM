const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
app.use(cors());
const connectToDatabase = require('./db/db');//connection to the DATABASE is to be made like this 
connectToDatabase();

const authRouter= require('./routes/auth');
const departmentRouter= require('./routes/department');
const employeeRouter= require('./routes/employee');
const salaryRouter=require('./routes/salary')
const leaveRouter=require('./routes/leave')
const dashboardRouter=require('./routes/dashboard')
const attendanceRouter=require('./routes/attendance')
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));
app.use('/api/auth', authRouter);
console.log("bskvsjnsk");
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/attendance', attendanceRouter);




app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 7870}`);
});