import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addToCart, updateQuantity, deleteItemInCart, loginInUser, convertIntoUserCart } from "../controllers/cartController.js";
  
const router = express.Router();

router.post("/", addToCart);
router.put("/", updateQuantity);
router.delete("/", deleteItemInCart);
router.get("/", loginInUser);
router.post("/merge", protect, convertIntoUserCart);

export default router;
