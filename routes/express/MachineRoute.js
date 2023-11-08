import express from "express";
const router = express.Router();

import {
  searchMachine,
  createMachine,
  getOneMachine,
  putMachine,
  deleteMachine,
} from "../../controllers/MachineController.js";

//Route
router.post("/search", searchMachine);
router.post("/", createMachine);
router.get("/:machineId", getOneMachine);
router.put("/:machineId", putMachine);
router.delete("/:machineId", deleteMachine);

export default router;
