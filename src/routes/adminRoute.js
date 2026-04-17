import express from "express";
import { addUsers, deleteUser, getAllUsers, updateUser } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";





const router = express.Router();


router.get("/",protect,admin,getAllUsers)
router.post("/",protect,admin,addUsers)
router.put("/:id",protect,admin,updateUser)
router.delete("/:id",protect,admin,deleteUser)















export default router