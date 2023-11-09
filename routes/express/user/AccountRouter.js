import express from 'express'
import {
  createAccount,
  deleteAccount,
  deleteAccountUser,
  getAccount,
  searchAccount,
  updateAccount,
  updateAccountUser
} from '../../../controllers/user/AccountController.js'
import {
  createApiKey,
  deleteApiKey,
  searchApiKeys,
  updateApiKey,
  updateTransport
} from '../../../controllers/user/AccountApiKeyController.js'

import { createMessage } from '../../../controllers/user/MessageController.js'
import authorizeAuth from '../../../middleware/authorizeAuth.js'
import checkAccessRule from '../../../middleware/checkAccessAccounts.js'
import expressAsyncHandler from 'express-async-handler'

const router = express.Router()

// creation d'un compte
router.post(
  '/',
  authorizeAuth,
  checkAccessRule('accounts/write'),
  expressAsyncHandler(createAccount)
)
// retourne tout les comptes
router.post(
  '/search',
  authorizeAuth,
  checkAccessRule('accounts/read'),
  expressAsyncHandler(searchAccount)
)
// retourne un compte
router.get(
  '/:accountId',
  authorizeAuth,
  checkAccessRule('accounts/read'),
  expressAsyncHandler(getAccount)
)
// modifie un compte
router.put(
  '/:accountId',
  authorizeAuth,
  checkAccessRule('accounts/write'),
  expressAsyncHandler(updateAccount)
)
// supprime un compte
router.delete(
  '/:accountId',
  authorizeAuth,
  checkAccessRule('accounts/write'),
  expressAsyncHandler(deleteAccount)
)

// modifie le transport
router.put(
  '/:accountId/transports/:transport',

  authorizeAuth,
  checkAccessRule('api/write'),
  expressAsyncHandler(updateTransport)
)
// creation d'une apikey apartir d'un compte
router.post(
  '/:accountId/access-groups/:accessGroupId/api-keys',
  authorizeAuth,
  checkAccessRule('api/write'),
  expressAsyncHandler(createApiKey)
)
// retourne tout les apikeys lié a un compte
router.post(
  '/:accountId/api-keys/search',
  authorizeAuth,
  checkAccessRule('api/read'),
  expressAsyncHandler(searchApiKeys)
)
// modifie l'apikey lié a un compte
router.put(
  '/:accountId/api-keys/:accountApiKeyId',
  authorizeAuth,
  checkAccessRule('accounts/write'),
  expressAsyncHandler(updateApiKey)
)

// supprime l'apikey lié a un compte
router.delete(
  '/:accountId/api-keys/:accountApiKeyId',
  authorizeAuth,
  checkAccessRule('accounts/write'),
  expressAsyncHandler(deleteApiKey)
)
// creation d'un message apartir d'un compte
router.post(
  '/:accountId/messages',
  authorizeAuth,
  checkAccessRule('messages/write'),
  expressAsyncHandler(createMessage)
)

// supprime un user  lié a un compte
router.delete(
  '/:accountId/users/:userId',
  authorizeAuth,
  checkAccessRule('accounts/write'),
  expressAsyncHandler(deleteAccountUser)
)

// modier un user  lié a un compte
router.put(
  '/:accountId/users/:userId',
  authorizeAuth,
  checkAccessRule('accounts/write'),
  expressAsyncHandler(updateAccountUser)
)
export default router
