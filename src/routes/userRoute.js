import User from "../models/userModel.js";
import express from "express";
import { userRegister, userLogin } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();

router.post("/register",userRegister)
router.post("/login",userLogin)
router.get("/profile",protect,async(req,res)=>{
    res.json(req.user)
    
})






export default router




