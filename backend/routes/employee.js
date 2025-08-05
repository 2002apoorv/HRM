const express= require("express")
const app=express();
app.use(express.json());
const authMiddleware =require("../middleware/authMiddleware");
const { getEmployees,addEmployee,upload ,getEmployee,updateEmployee,fetchEmployeesByDepId} = require("../controller/employeeController");
const router =express.Router();

router.get("/",authMiddleware,getEmployees )
router.get("/:id",authMiddleware,getEmployee )
router.post("/add",authMiddleware,upload.single('image'),addEmployee )
router.put("/:id",authMiddleware,updateEmployee)
router.get("/department/:id",authMiddleware,fetchEmployeesByDepId)


module.exports=router;
