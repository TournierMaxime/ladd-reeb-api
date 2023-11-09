import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchOrder,
  createOrder,
  getOneOrder,
  putOrder,
  deleteOrder
} from '../../controllers/OrderController.js'
// import authorizeAuth from '../../middleware/authorizeAuth.js'

const router = express.Router()

router.post('/search', expressAsyncHandler(searchOrder))
router.post('/new', expressAsyncHandler(createOrder))
router.get('/:orderId', expressAsyncHandler(getOneOrder))
router.put('/:orderId', expressAsyncHandler(putOrder))
router.delete('/:orderId', expressAsyncHandler(deleteOrder))

export default router
