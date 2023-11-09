import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchPaymentMean,
  createPaymentMean,
  getPaymentMean
} from '../../controllers/PaymentMeanController.js'
import authorizeAuth from '../../middleware/authorizeAuth.js'
const router = express.Router()

router.post('/search', authorizeAuth, expressAsyncHandler(searchPaymentMean))
router.post('/new', authorizeAuth, expressAsyncHandler(createPaymentMean))
router.get('/:paymentMeanId', authorizeAuth, expressAsyncHandler(getPaymentMean))

export default router
