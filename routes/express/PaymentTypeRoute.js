import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchPaymentType,
  getPaymentType
} from '../../controllers/PaymentTypeController.js'
const router = express.Router()

router.post('/search', expressAsyncHandler(searchPaymentType))
router.get('/:paymentTypeId', expressAsyncHandler(getPaymentType))

export default router
