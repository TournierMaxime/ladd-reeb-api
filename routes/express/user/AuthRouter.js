import express from 'express'
import expressAsyncHandler from 'express-async-handler'

// Controllers
import {
  register,
  login,
  loginWithDevices,
  verifyEmail,
  forgetPassword,
  resetPassword,
  logout,
  forgetPasswordMobile,
  checkforgetPasswordCodeMobile,
  resetPasswordMobile
} from '../../../controllers/user/AuthController.js'
const router = express.Router()

// Route
router.post('/register', expressAsyncHandler(register))
router.post('/verify/:userId', expressAsyncHandler(verifyEmail))
router.post('/login', expressAsyncHandler(login))
router.post('/login-with-devices', expressAsyncHandler(loginWithDevices))
router.post('/forget-password', expressAsyncHandler(forgetPassword))
router.put('/reset-password/:token', expressAsyncHandler(resetPassword))
router.post('/logout', expressAsyncHandler(logout))
router.post('/forget-password-mobile', expressAsyncHandler(forgetPasswordMobile))
router.post('/check-forget-password-code-mobile', expressAsyncHandler(checkforgetPasswordCodeMobile))
router.post('/reset-password-mobile', expressAsyncHandler(resetPasswordMobile))

export default router
