import axios from 'axios'

async function sendSmsFactorApi (apiKey, text, from, to) {
  await axios.get('https://api.smsfactor.com/send', {
    params: { text, to, sender: from },
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + apiKey
    }
  })
}

async function sendSmsFromTransport (transport, msg) {
  if (transport.api === 'smsFactor') {
    if (!transport.smsFactorApiKey) {
      throw new Error('smsFactorApiKey is not set in transport data')
    }
    await sendSmsFactorApi(transport.smsFactorApiKey, msg.text, msg.from, msg.to)
  } else {
    throw new Error('Sms transport api is not implemented')
  }
}

async function sendSmsFromAccount (account, recipient, data) {
  const transport = account.data?.transports?.sms
  if (!transport) {
    throw new Error('Sms transport is not set in account data')
  }
  await sendSmsFromTransport(transport, {
    from: transport.from,
    to: recipient,
    ...data
  })
}

export { sendSmsFromAccount }
