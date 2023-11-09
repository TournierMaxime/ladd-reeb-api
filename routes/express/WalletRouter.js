import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchWallet,
  getOneWallet,
  putWallet,
  deleteWallet
} from '../../controllers/WalletController.js'
import authorizeAuth from '../../middleware/authorizeAuth.js'

const router = express.Router()

router.post('/search', authorizeAuth, expressAsyncHandler(searchWallet))
router.get('/:userId', authorizeAuth, expressAsyncHandler(getOneWallet))
router.put('/:userId', authorizeAuth, expressAsyncHandler(putWallet))
router.delete('/:userId', authorizeAuth, expressAsyncHandler(deleteWallet))

export default router
