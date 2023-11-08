import sendgrid from '@sendgrid/mail'
import nodemailer from 'nodemailer'

const sendEmailFromTransport = async (transport, msg) => {
  if (transport.api === 'smtp') {
    if (!transport.smtpHost) {
      throw new Error('smtpHost is not set in transport data')
    }
    if (!transport.smtpPort) {
      throw new Error('smtpPort is not set in transport data')
    }
    if (!transport.smtpUser) {
      throw new Error('smtpUser is not set in transport data')
    }
    if (!transport.smtpPassword) {
      throw new Error('smtpPassword is not set in transport data')
    }
    const transporter = nodemailer.createTransport({
      host: transport.smtpHost,
      port: transport.smtpPort,
      secure: transport.smtpSecure ?? false,
      auth: {
        user: transport.smtpUser,
        pass: transport.smtpPassword
      }
    })
    return transporter.sendMail({
      from: msg.from,
      to: msg.to,
      subject: msg.subject,
      text: msg.text,
      html: msg.html
    })
  } else if (transport.api === 'sendgrid') {
    if (!transport.sendGridApiKey) {
      throw new Error('sendGridApiKey is not set in transport data')
    }
    sendgrid.setApiKey(transport.sendGridApiKey)
    return sendgrid.send(msg)
  } else {
    throw new Error('Email transport api is not implemented')
  }
}

async function sendEmailFromAccount (account, recipient, data) {
  const transport = account.data?.transports?.email
  if (!transport) {
    throw new Error('Email transport is not set in account data')
  }
  await sendEmailFromTransport(transport, {
    from: transport.from,
    to: recipient,
    ...data
  })
}

export { sendEmailFromAccount, sendEmailFromTransport }
