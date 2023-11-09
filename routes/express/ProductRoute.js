import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchProduct,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct
} from '../../controllers/ProductController.js'
const router = express.Router()

router.post('/search', expressAsyncHandler(searchProduct))
router.post('/new', expressAsyncHandler(createProduct))
router.get('/:productId', expressAsyncHandler(getProduct))
router.put('/:productId', expressAsyncHandler(updateProduct))
router.delete('/:productId', expressAsyncHandler(deleteProduct))

export default router
