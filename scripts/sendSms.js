import { initDatabase, releaseDatabase } from '../lib/sequelize.js'
import Message from '../models/Message.js'
import Account from '../models/Account.js'
import { sendMessage } from '../lib/messages.js'
import { logger } from '../lib/logger.js'

const subProcess = 'sendSms'

await initDatabase()

// creation d'un compte avec tout les droits
const messages = await Message.findAll({
  where: { type: 'sms', status: 'new' },
  limit: 5,
  include: { model: Account },
  order: [['createdAt', 'ASC']]
})

for (const message of messages) {
  await sendMessage(message)
}

await releaseDatabase()

logger.info({
  subProcess,
  msg: 'Ended successfully'
})
