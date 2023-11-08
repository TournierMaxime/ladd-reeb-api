import express from "express";
const router = express.Router();

import {
  searchProduct,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/ProductController.js";

router.post("/search", searchProduct);
router.post("/", createProduct);
router.get("/:productId", getProduct);
router.put("/:productId", updateProduct);
router.delete("/:productId", deleteProduct);

export default router;
