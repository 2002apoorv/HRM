const { Employee } = require('../models/Employee');
const Salary=require('../models/Salary')

const addSalary=async (req,res)=>{
    try{
        const {employeeId,basicSalary,allowances,deductions,payDate}=req.body;
        const totalSalary=parseInt(basicSalary)+parseInt(allowances)-parseInt(deductions)
        console.log(req.body);
        const newSalary=new Salary({
            employeeId,
            basicSalary,
            allowance:allowances,
            deductions,
            netSalary:totalSalary,
            payDate
        })

        await newSalary.save()

        return res.status(200).json({success:true})
    }
    catch(error){
        return res.status(500).json({success:false,error:"Salary add server error"})
    }
}

const getSalary=async(req,res)=>{
    try{
        const {id,role}=req.params;
        let salary;
        if(role==='admin'){
            salary=await Salary.find({employeeId:id}).populate('employeeId','employeeId')
        }else{
            const employee=await Employee.findOne({userId:id})
            salary=await Salary.find({employeeId:employee._id}).populate('employeeId','employeeId')
        }
        return res.status(200).json({success:true,salary})
    }
    catch(error){
        return res.status(500).json({success:false,error:"Salary get server error"})
    }
}

module.exports={addSalary,getSalary}