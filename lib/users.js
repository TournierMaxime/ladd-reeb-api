import User from '../models/user/User.js'
import Wallet from '../models/Wallet.js'
import PaymentMean from '../models/PaymentMean.js'
import PaymentType from '../models/PaymentType.js'
import UserToAccountAccessGroup from '../models/user/UserToAccountAccessGroup.js'
import { generateKeyHash } from './keys.js'
import AccessGroup from '../models/user/AccessGroup.js'

const createAnonymousUser = async (transaction) => {
  const user = await User.create(
    { verified: true },
    {
      transaction
    }
  )

  const accessGroup = await AccessGroup.findOne({
    where: {
      name: 'customer'
    }
  }, {
    transaction
  })

  await UserToAccountAccessGroup.create({
    userId: user.userId,
    accessGroupId: accessGroup.accessGroupId
  },
  {
    transaction
  })

  const wallet = await Wallet.create(
    {
      userId: user.userId
    },
    {
      transaction
    }
  )

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
}

const createUser = async (transaction, pseudo, email, password) => {
  const code = Math.floor(100000 + Math.random() * 900000)

  const data = {
    pseudo,
    email,
    passwordHash: generateKeyHash(password),
    verificationCode: code
  }

  const user = await User.create(data, {
    transaction
  })

  return user
}

export { createUser, createAnonymousUser }
