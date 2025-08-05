const mongoose = require('mongoose')
const { Employee } = require('./Employee')
const Leave = require('./Leave')
const Salary = require('./Salary')


const departmentSchema = new mongoose.Schema({
    dep_name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }, createdAt: {
        type: Date,
        default: Date.now()
    }, updatedAt: {
        type: Date,
        default: Date.now()
    }
})

departmentSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        const employees = await Employee.find({ department: this._id })
        const empIds = employees.map(emp => emp._id)

        await Employee.deleteMany({ department: this._id })
        await Leave.deleteMany({ employeeId: { $in: empIds } })
        await Salary.deleteMany({ employeeId: { $in: empIds } })
        next();
    }
    catch (err) {
        next(err);  
}})

const Department = mongoose.model("Department", departmentSchema)

module.exports = { Department }