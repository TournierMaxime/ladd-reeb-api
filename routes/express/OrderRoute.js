import express from "express";
const router = express.Router();

import {
  searchOrder,
  createOrder,
  getOneOrder,
  putOrder,
  deleteOrder,
} from "../../controllers/OrderController.js";

//Route
router.post("/search", searchOrder);
router.post("/", createOrder);
router.get("/:orderId", getOneOrder);
router.put("/:orderId", putOrder);
router.delete("/:orderId", deleteOrder);

export default router;
