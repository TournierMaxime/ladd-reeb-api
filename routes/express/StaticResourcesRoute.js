import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import { backgroundsImages } from '../../controllers/StaticResourcesController.js'

const router = express.Router()

router.get('/backgrounds/:format', expressAsyncHandler(backgroundsImages))

export default router
