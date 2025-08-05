const {Employee} = require('../models/Employee');
const {Department} = require('../models/Department');
const Leave = require('../models/Leave');
const Salary = require('../models/Salary');

const getSummary = async (req, res) => {
    try {
        // Fetching the summary data from the database
        const totalEmployees = await Employee.countDocuments();
        const totalDepartments = await Department.countDocuments();
        const totalSalaries = await Salary.countDocuments();

        // const totalSalaries = await Employee.aggregate([
        //     { $group: { _id: null, totalSalary: { $sum: "$salary" } } }
        // ]);

        const employeeAppliedForLeave = await Leave.distinct("employeeId");

        const leaveStatus = await Leave.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ])


        const leaveSummary = {
            appliedFor: employeeAppliedForLeave.length,
            approved: leaveStatus.find(item => item._id === "Approved")?.count || 0,
            rejected: leaveStatus.find(item => item._id === "Rejected")?.count || 0,
            pending: leaveStatus.find(item => item._id === "Pending")?.count || 0,
        }


        // Sending the summary response
        res.status(200).json({
            success: true,
            totalEmployees,
            totalDepartments,
            totalSalaries: totalSalaries,
            leaveSummary
        });
    } catch (error) {
        console.error("Error fetching summary:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = {
    getSummary
}