import express from "express";
const router = express.Router();

import {
  searchStock,
  createStock,
  getOneStock,
  putStock,
  deleteStock,
} from "../../controllers/StockController.js";

//Route
router.post("/search", searchStock);
router.post("/", createStock);
router.get("/:stockId", getOneStock);
router.put("/:stockId", putStock);
router.delete("/:stockId", deleteStock);

export default router;
