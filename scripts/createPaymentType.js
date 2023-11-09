import { initDatabase, releaseDatabase, sequelize } from '../lib/sequelize.js'
import { logger } from '../lib/logger.js'
import PaymentType from '../models/PaymentType.js'

await initDatabase()

const subProcess = 'createPaymentType'

sequelize.transaction(async (t) => {
  const paymentTypesToCreate = [
    { type: 'Credit Card' },
    { type: 'Transfer' },
    { type: 'Cash' },
    { type: 'Bracelet' }
  ]

  await PaymentType.bulkCreate(paymentTypesToCreate, {
    updateOnDuplicate: ['type'],
    returning: true,
    transaction: t
  })
})

await releaseDatabase()

logger.info({
  subProcess,
  msg: 'Ended successfully'
})
