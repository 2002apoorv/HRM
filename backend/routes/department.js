const express= require("express")
const app=express();
app.use(express.json());
const authMiddleware =require("../middleware/authMiddleware");
const { addDepartment,getDepartment } = require("../controller/departmentController");
const router =express.Router();

router.get("/",authMiddleware,getDepartment )

router.post("/add",authMiddleware,addDepartment )


module.exports=router;
