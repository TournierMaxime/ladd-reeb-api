import { initDatabase, releaseDatabase, sequelize } from '../lib/sequelize.js'
import { logger } from '../lib/logger.js'
import Product from '../models/Product.js'

await initDatabase()

const subProcess = 'createProducts'

sequelize.transaction(async (t) => {
  const paymentTypesToCreate = [
    { title: 'Bière 1', description: 'Une bière', price: 6.0, size: 33, image: `${process.env.API_URI}/images/33cl.png` },
    { title: 'Bière 2', description: 'Une bière', price: 12.0, size: 50, image: `${process.env.API_URI}/images/50cl.png` }
  ]

  await Product.bulkCreate(paymentTypesToCreate, {
    updateOnDuplicate: ['title', 'description', 'price', 'size', 'image'],
    returning: true,
    transaction: t
  })
})

await releaseDatabase()

logger.info({
  subProcess,
  msg: 'Ended successfully'
})
