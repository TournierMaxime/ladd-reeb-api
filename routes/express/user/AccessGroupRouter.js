import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  createAccessGroup,
  getOneAccessGroup,
  putAccessGroup,
  searchAccessGroup
} from '../../../controllers/user/AccessGroupController.js'
import authorizeAuth from '../../../middleware/authorizeAuth.js'
import checkAccessRule from '../../../middleware/checkAccessAccounts.js'

const router = express.Router()

router.post(
  '/',
  authorizeAuth,
  checkAccessRule('access-groups/write'),
  expressAsyncHandler(createAccessGroup)
)
router.get(
  '/:accessGroupId',
  authorizeAuth,
  checkAccessRule('access-groups/read'),
  expressAsyncHandler(getOneAccessGroup)
)
router.post(
  '/search',
  authorizeAuth,
  checkAccessRule('access-groups/read'),
  expressAsyncHandler(searchAccessGroup)
)
router.put(
  '/:accessGroupId',
  authorizeAuth,
  checkAccessRule('access-groups/write'),
  expressAsyncHandler(putAccessGroup)
)

export default router
