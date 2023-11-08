import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  deleteUser,
  getUser,
  searchUsers,
  updateUser
} from '../../../controllers/user/UserController.js'
import authorizeAuth from '../../../middleware/authorizeAuth.js'
import checkAccessRule from '../../../middleware/checkAccessAccounts.js'

const router = express.Router()

router.post(
  '/search',
  authorizeAuth,
  checkAccessRule('users/read'),
  expressAsyncHandler(searchUsers)
)

router.get(
  '/:userId',
  authorizeAuth,
  checkAccessRule('users/read'),
  expressAsyncHandler(getUser)
)

router.put(
  '/:userId',
  authorizeAuth,
  checkAccessRule('users/write'),
  expressAsyncHandler(updateUser)
)

router.delete(
  '/:userId',
  authorizeAuth,
  checkAccessRule('users/write'),
  expressAsyncHandler(deleteUser)
)

export default router
