const express= require("express")
const app=express();
app.use(express.json());
const authMiddleware =require("../middleware/authMiddleware");
const {addLeave,getLeave,getLeaves,getLeaveDetail,updateLeave}=require("../controller/leaveController")


const router =express.Router();


router.post("/add",authMiddleware,addLeave )
router.get("/detail/:id",authMiddleware,getLeaveDetail)
router.get("/:id/:role",authMiddleware,getLeave )


router.get("/",authMiddleware,getLeaves)
router.put("/:id",authMiddleware,updateLeave )


module.exports=router;
