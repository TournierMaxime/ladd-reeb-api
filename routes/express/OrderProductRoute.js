import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchOrderProduct,
  createOrderProduct,
  getOneOrderProduct,
  putOrderProduct,
  deleteOrderProduct
} from '../../controllers/OrderProductController.js'
const router = express.Router()

// Route
router.post('/search', expressAsyncHandler(searchOrderProduct))
router.post('/new', expressAsyncHandler(createOrderProduct))
router.get('/:orderProductId', expressAsyncHandler(getOneOrderProduct))
router.put('/:orderProductId', expressAsyncHandler(putOrderProduct))
router.delete('/:orderProductId', expressAsyncHandler(deleteOrderProduct))

export default router
