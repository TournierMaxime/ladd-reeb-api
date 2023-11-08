import User from '../models/user/User.js'
import { randomBytes } from 'crypto'
// import { sendEmailFromAccount } from './transport/email.js'
// import { getRootAccount } from './accounts.js'
import { generateKeyHash } from './keys.js'
// import { renderTemplate } from './templates.js'

const createUser = async (transaction, firstName, lastName, email, password) => {
  const data = {
    firstName,
    lastName,
    email,
    passwordHash: generateKeyHash(password),
    verificationCode: randomBytes(16).toString('hex')
  }

  const user = await User.create(data, {
    transaction
  })

  return user

  // const verificationCodeUrl = `${process.env.AUTH_FRONT_URL}/api/v1/auth/verify/${user.verificationCode}`

  // await sendEmailFromAccount(await getRootAccount(), user.email, {
  //   subject: "verification email",
  //   text: renderTemplate("emails/verificationCode.text.hbs", {
  //     user,
  //     verificationCodeUrl,
  //   }),
  //   html: renderTemplate("emails/verificationCode.html.hbs", {
  //     user,
  //     verificationCodeUrl,
  //   }),
  // });
}

export { createUser }
