import jwt from 'jsonwebtoken'
import { getRootAccount } from '../../lib/accounts.js'
import {
  HttpBadRequestError,
  HttpNotFoundError,
  HttpUnauthorizedError
} from '../../lib/errors.js'
import { compareKeyWithKeyHash, generateKeyHash } from '../../lib/keys.js'
import { sequelize } from '../../lib/sequelize.js'
import { renderTemplate } from '../../lib/templates.js'
import { sendEmailFromAccount } from '../../lib/transport/email.js'
import { createUser } from '../../lib/users.js'
import AccessGroup from '../../models/user/AccessGroup.js'
import User from '../../models/user/User.js'
import UserToAccountAccessGroup from '../../models/user/UserToAccountAccessGroup.js'

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  const existingUser = await User.findOne({ where: { email } })

  if (existingUser) {
    throw new HttpBadRequestError('User already exists with the given email')
  }

  const user = await sequelize.transaction(async (transaction) => {
    const user = await createUser(transaction, firstName, lastName, email, password)

    const accessGroup = await AccessGroup.findOne({
      where: { name: 'customer' }
    })
    if (accessGroup === null) {
      throw new Error('pas de groupe')
    }
    await UserToAccountAccessGroup.findOrCreate({
      where: {
        userId: user.userId,
        accountId: null,
        accessGroupId: accessGroup.accessGroupId
      },
      transaction
    })

    return user
  })

  res.status(201).json({
    user
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ where: { email } })

  if (!user) throw new HttpNotFoundError('User does not exist')
  if (!user.verified) throw new HttpUnauthorizedError('User not verified')

  if (!compareKeyWithKeyHash(password, user.passwordHash)) {
    throw new HttpUnauthorizedError('Invalid password')
  }

  const token = jwt.sign(
    { userId: user.userId },
    process.env.JWT_COOKIE_SECRET
  )
  res.cookie('access_token', token, {
    maxAge: 24 * 3600 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  })

  // send user data
  res.status(201).json({
    user
  })
}

const verifyEmail = async (req, res) => {
  const verificationCode = req.params.verificationCode

  const user = await User.findOne({
    where: { verificationCode }
  })

  if (!user) {
    throw new HttpNotFoundError('User does not exist')
  }

  user.verified = true
  user.verificationCode = undefined
  user.save()

  res.status(200).json({})
}

const forgetPassword = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } })
  if (!user) {
    return res.status(401).json({
      error: 'User with that email does not exist'
    })
  }
  const token = jwt.sign({}, process.env.JWT_RESET_PASSWORD_SECRET, {
    expiresIn: '10m'
  })
  user.forgetPassword = token
  user.save()

  const resetPasswordUrl = `${process.env.AUTH_FRONT_URL}/resetPassword/${token}`

  await sendEmailFromAccount(await getRootAccount(), user.email, {
    subject: 'reset password',
    text: renderTemplate('emails/resetPassword.text.hbs', {
      user,
      resetPasswordUrl
    }),
    html: renderTemplate('emails/resetPassword.html.hbs', {
      user,
      resetPasswordUrl
    })
  })

  res.status(200).json({})
}

const resetPassword = async (req, res) => {
  if (
    !(await jwt.verify(req.params.token, process.env.JWT_RESET_PASSWORD_SECRET))
  ) {
    throw new HttpUnauthorizedError()
  }

  const user = await User.findOne({
    where: { forgetPassword: req.params.token }
  })

  if (!user) {
    throw new HttpUnauthorizedError()
  }

  user.passwordHash = generateKeyHash(req.body.password)
  user.forgetPassword = undefined
  user.save()

  res.status(200).json({})
}

const logout = async (req, res) => {
  res.cookie('access_token', 'none', {
    maxAge: 5,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  })
  res.status(200).json({})
}

export { register, login, verifyEmail, logout, forgetPassword, resetPassword }
