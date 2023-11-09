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
import { createUser, createAnonymousUser } from '../../lib/users.js'
import AccessGroup from '../../models/user/AccessGroup.js'
import User from '../../models/user/User.js'
import UserToAccountAccessGroup from '../../models/user/UserToAccountAccessGroup.js'
import Wallet from '../../models/Wallet.js'
import moment from 'moment'
import PaymentMean from '../../models/PaymentMean.js'
import PaymentType from '../../models/PaymentType.js'

const register = async (req, res) => {
  const { pseudo, email, password } = req.body

  const existingUser = await User.findOne({ where: { email } })

  if (existingUser) {
    throw new HttpBadRequestError('User already exists with the given email')
  }

  const user = await sequelize.transaction(async (transaction) => {
    const user = await createUser(transaction, pseudo, email, password)

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

    const wallet = await Wallet.findOrCreate({
      where: {
        userId: user.userId
      },
      transaction
    })

    const paymentType = await PaymentType.findOne({
      where: { type: 'Credit Card' }
    }, transaction)

    await PaymentMean.create(
      {
        userId: user.userId,
        walletId: wallet.walletId,
        paymentTypeId: paymentType.paymentTypeId,
        deleted: false,
        isDefault: true
      },
      {
        transaction
      }
    )

    return user
  })

  await sendEmailFromAccount(await getRootAccount(), user.email, {
    subject: 'Confirmation de votre email',
    text: renderTemplate('emails/verificationCode.text.hbs', {
      user
    }),
    html: renderTemplate('emails/verificationCode.html.hbs', {
      user
    })
  })

  res.status(201).json({
    user,
    success: 'Un email de confirmation de compte vous a été envoyé'
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ where: { email }, attributes: ['userId', 'braceletId', 'isAssociatedBracelet', 'email', 'firstName', 'lastName', 'pseudo', 'passwordHash', 'verified', 'created'] })

  if (!user) throw new HttpNotFoundError('User does not exist')
  if (!user.verified) throw new HttpUnauthorizedError('User not verified')

  if (!compareKeyWithKeyHash(password, user.passwordHash)) {
    throw new HttpUnauthorizedError('Invalid password')
  }

  const expirationDate = moment().add(1, 'month')

  const token = jwt.sign(
    { userId: user.userId },
    process.env.JWT_COOKIE_SECRET
  )
  res.cookie('access_token', token, {
    expires: expirationDate.toDate(),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  })

  // send user data
  res.status(201).json({
    user,
    token
  })
}

const loginWithDevices = async (req, res) => {
  const { userId, braceletId } = req.body

  let user
  if (userId) {
    user = await User.findOne({
      where: { userId },
      attributes: [
        'userId',
        'braceletId',
        'isAssociatedBracelet',
        'email',
        'pseudo',
        'firstName',
        'lastName',
        'verified'
      ]
    })
  } else if (braceletId) {
    user = await User.findOne({
      where: { braceletId },
      attributes: [
        'userId',
        'braceletId',
        'isAssociatedBracelet',
        'email',
        'pseudo',
        'firstName',
        'lastName',
        'verified'
      ],
      include: {
        model: Wallet,
        attributes: ['credits']
      }
    })
  } else {
    user = await createAnonymousUser()
  }

  if (!user) throw new HttpNotFoundError('User does not exist')
  if (!user.verified) throw new HttpUnauthorizedError('User not verified')

  let token
  if (userId) {
    token = jwt.sign({ userId: user.userId }, process.env.JWT_DEVICE_SECRET)
  } else if (braceletId) {
    token = jwt.sign({ userId: user.userId }, process.env.JWT_DEVICE_SECRET)
  } else {
    token = jwt.sign({ userId: user.userId }, process.env.JWT_DEVICE_SECRET)
  }

  const expirationDate = moment().add(1, 'month')

  res.cookie('access_token_devices', token, {
    expires: expirationDate.toDate(),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  })

  res.status(200).json({
    user,
    token,
    success: 'Connexion réussie'
  })
}

const verifyEmail = async (req, res) => {
  const { userId } = req.params
  const { code } = req.body

  const user = await User.findOne({
    where: { userId }
  })

  if (!user) {
    throw new HttpNotFoundError('Utilisateur introuvable')
  }

  user.verified = true
  user.verificationCode = undefined
  user.save({ ...code, verified: user.verified = true, verificationCode: user.verificationCode = undefined })

  res.status(200).json({ message: 'Compte vérifié avec succès' })
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

const forgetPasswordMobile = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ where: { email } })

  if (!user) {
    throw new HttpUnauthorizedError('Email manquant ou invalide')
  }

  if (!email) {
    throw new HttpBadRequestError('Email manquant ou invalide')
  }

  const code = Math.floor(100000 + Math.random() * 900000)

  user.forgetPassword = code
  user.save()

  await sendEmailFromAccount(await getRootAccount(), user.email, {
    subject: 'Rénitialisation mot de passe',
    text: renderTemplate('emails/resetPasswordMobile.text.hbs', {
      user,
      code
    }),
    html: renderTemplate('emails/resetPasswordMobile.html.hbs', {
      user,
      code
    })
  })

  res.status(200).json({})
}

const checkforgetPasswordCodeMobile = async (req, res) => {
  const { email, code } = req.body
  if (!code) {
    throw new HttpBadRequestError('Tous les champs sont obligatoires')
  }
  // Trouve l'utilisateur correspondant à l'adresse email fournie
  const user = await User.findOne({ where: { email } })
  if (!user) {
    throw new HttpUnauthorizedError('Aucun utilisateur avec cette adresse e-mail n\'a été trouvé')
  }
  // Vérifie que le code de vérification correspond au code envoyé par e-mail
  if (user.forgetPassword !== code) {
    throw new HttpBadRequestError('Code de vérification invalide')
  }
  await user.save()

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

const resetPasswordMobile = async (req, res) => {
  const { email, password, confirmPassword } = req.body

  const user = await User.findOne({ where: { email } })
  if (!user) {
    throw new HttpNotFoundError('Utilisateur introuvable')
  }

  if (!password || !confirmPassword) {
    throw new HttpBadRequestError('Tous les champs sont obligatoires')
  }

  if (password !== confirmPassword) {
    throw new HttpBadRequestError('Les mots de passe ne correspondent pas')
  }

  if (password === confirmPassword) {
    user.passwordHash = generateKeyHash(password)
    user.forgetPassword = undefined
    user.save()
  }

  console.log(`Le mot de passe de ${email} a été mis à jour avec succès.`)

  res.status(200).json({})
}

const logout = async (req, res) => {
  res.clearCookie('access_token')
  res.status(200).json({ message: 'Successfully logout' })
}

export {
  register,
  login,
  loginWithDevices,
  verifyEmail,
  logout,
  forgetPassword,
  forgetPasswordMobile,
  checkforgetPasswordCodeMobile,
  resetPassword,
  resetPasswordMobile
}
