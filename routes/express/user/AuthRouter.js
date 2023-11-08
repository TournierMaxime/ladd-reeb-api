import express from "express";
import expressAsyncHandler from "express-async-handler";

// Controllers
import {
  register,
  login,
  verifyEmail,
  forgetPassword,
  resetPassword,
  logout,
} from "../../../controllers/user/AuthController.js";
const router = express.Router();

// Route
router.post("/register", expressAsyncHandler(register));
router.get("/verify/:verificationCode", expressAsyncHandler(verifyEmail));
router.post("/login", expressAsyncHandler(login));
router.post("/forget-password", expressAsyncHandler(forgetPassword));
router.put("/reset-password/:token", expressAsyncHandler(resetPassword));
router.post("/logout", expressAsyncHandler(logout));

export default router;
