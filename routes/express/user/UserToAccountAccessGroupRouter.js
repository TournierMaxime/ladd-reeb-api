import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  createUserToAccountAccessGroup,
  allUserToAccountAccessGroup,
  getUserToAccountAccessGroup
} from '../../../controllers/user/UserToAccountAccessGroupController.js'
import authorizeAuth from '../../../middleware/authorizeAuth.js'
import checkAccessRule from '../../../middleware/checkAccessAccounts.js'

const router = express.Router()

router.post(
  '/:accountId/access-groups/:accessGroupId/users',
  authorizeAuth,
  checkAccessRule('user-to-account/write'),
  expressAsyncHandler(createUserToAccountAccessGroup)
)

router.post(
  '/search',
  authorizeAuth,
  checkAccessRule('user-to-account/read'),
  expressAsyncHandler(allUserToAccountAccessGroup)
)

router.get(
  '/:userToAccountAccessGroupId',
  authorizeAuth,
  checkAccessRule('user-to-account/read'),
  expressAsyncHandler(getUserToAccountAccessGroup)
)

export default router
