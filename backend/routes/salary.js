const express= require("express")
const app=express();
app.use(express.json());
const authMiddleware =require("../middleware/authMiddleware");
const {addSalary,getSalary}=require('../controller/salaryController')

const router =express.Router();


router.post("/add",authMiddleware,addSalary )
router.get("/:id/:role",authMiddleware,getSalary )
 


module.exports=router;
