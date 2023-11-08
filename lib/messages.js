import { logger } from './logger.js'
import { sendEmailFromAccount } from './transport/email.js'
import { sendSmsFromAccount } from './transport/sms.js'

const subProcess = 'messages'

async function sendMessage (message) {
  if (message.status !== 'new') {
    throw new Error('Bad message status')
  }

  const account = message.Account

  if (!account) {
    throw new Error('Account not loaded with message')
  }

  const transports = account.data?.transports

  if (!transports) {
    throw new Error('Transports not set in account data')
  }

  const transport = transports[message.type]

  if (!transport) {
    throw new Error(`Transport ${message.type} not set in account data`)
  }

  try {
    if (message.type === 'sms') {
      await sendSmsFromAccount(account, message.recipient, message.data)
    } else if (message.type === 'email') {
      await sendEmailFromAccount(account, message.recipient, message.data)
    } else {
      throw new Error('Message type is not implemented')
    }

    message.status = 'sent'
    await message.save()
  } catch (error) {
    message.status = 'error'
    await message.save()

    logger.error({
      subProcess,
      msg: 'Error while sending message',
      errMsg: error.message
    })
  }
}

export {
  sendMessage
}
