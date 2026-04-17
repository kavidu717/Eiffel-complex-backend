import express from "express";
import { protect,admin } from "../middleware/authMiddleware.js";
import { createProduct,
    updateProduct,
    deleteProduct,
    getAllProduct,
     singleProduct,
     similarProduct,
      bestSeller, 
      newArrival} from "../controllers/productController.js";








const router = express.Router();

router.post("/",protect,admin,createProduct)
router.put("/:id",protect,admin,updateProduct)
router.delete("/:id",protect,admin,deleteProduct)
router.get("/",getAllProduct)
router.get("/best-seller",bestSeller)

router.get("/new-arrival",newArrival)
router.get("/:id",singleProduct)
router.get("/similar/:id",similarProduct)














export default router