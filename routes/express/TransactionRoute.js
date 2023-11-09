import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchTransaction,
  createTransaction,
  createTransactionCashless,
  getOneTransaction,
  updateTransaction,
  deleteTransaction
} from '../../controllers/TransactionController.js'

const router = express.Router()

router.post('/search', expressAsyncHandler(searchTransaction))
router.post('/:orderId/new', expressAsyncHandler(createTransaction))
router.post('/new', expressAsyncHandler(createTransactionCashless))
router.get('/:transactionId', expressAsyncHandler(getOneTransaction))
router.put('/:transactionId', expressAsyncHandler(updateTransaction))
router.delete('/:transactionId', expressAsyncHandler(deleteTransaction))

export default router
