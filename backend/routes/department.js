const express= require("express")
const app=express();
app.use(express.json());
const authMiddleware =require("../middleware/authMiddleware");
const { addDepartment,getDepartment,updateDepartment ,getDepartmentt,deleteDepartment} = require("../controller/departmentController");
const router =express.Router();

router.get("/",authMiddleware,getDepartment )

router.post("/add",authMiddleware,addDepartment )
router.get("/:id",authMiddleware,getDepartmentt )
router.put("/:id",authMiddleware,updateDepartment )
router.delete("/:id",authMiddleware,deleteDepartment )

module.exports=router;
