const { Department } = require("../models/Department");

const addDepartment = async (req, res) => {

    try {
        const { dep_name, description } = req.body;

        const newDep = new Department({
            dep_name, description
        })
        await newDep.save();
        return res.status(200).json({ success: true, department: newDep, msg: "The department has been added" })
    }
    catch (err) {
        return res.status(500).json({ success: false, error: "add department server error" })
    }
}

const getDepartment = async (req, res) => {
    try {
        const departments = await Department.find();
        console.log(departments)
        return res.status(200).json({ success: true, departments: departments })
    } catch (err) {
        return res.status(500).json({ success: false, error: "add department server error" })
    }
}

const getDepartmentt = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await Department.findById({ _id: id })
        return res.status(200).json({ success: true, department: department })
    } catch (err) {
        return res.status(500).json({ success: false, error: "add department server error" })
    }
}

const updateDepartment=async (req,res)=>{
    try{
        const {id}=req.params;
        const {dep_name,description}=req.body;
        const updateDep=await Department.findByIdAndUpdate(id,{
            dep_name,description
        })
    return res.status(200).json({ success: true, updateDep })
    } catch (err) {
        return res.status(500).json({ success: false, error: "edit sdvdsvdepartment server error" })
    }
}

const deleteDepartment=async(req,res)=>{
    try{
        const {id}=req.params;
        const deleteDep=await Department.findById(id)
        await deleteDep.deleteOne();
    return res.status(200).json({ success: true, deleteDep })
    } catch (err) {
        return res.status(500).json({ success: false, error: "delete department server error" })
    }
}

module.exports = { addDepartment, getDepartment, updateDepartment,getDepartmentt ,deleteDepartment}