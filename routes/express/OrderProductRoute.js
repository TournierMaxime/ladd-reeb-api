import express from "express";
const router = express.Router();

import {
  searchOrderProduct,
  createOrderProduct,
  getOneOrderProduct,
  putOrderProduct,
  deleteOrderProduct,
} from "../../controllers/OrderProductController.js";

//Route
router.post("/search", searchOrderProduct);
router.post("/", createOrderProduct);
router.get("/:orderProductId", getOneOrderProduct);
router.put("/:orderProductId", putOrderProduct);
router.delete("/:orderProductId", deleteOrderProduct);

export default router;
