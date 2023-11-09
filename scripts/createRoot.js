import { generateKey, generateKeyHash } from '../lib/keys.js'
import AccessGroup from '../models/user/AccessGroup.js'
import Account from '../models/user/Account.js'
import { initDatabase, releaseDatabase, sequelize } from '../lib/sequelize.js'
import { logger } from '../lib/logger.js'
import AccountApiKey from '../models/user/AccountApiKey.js'
import User from '../models/user/User.js'
import UserToAccountAccessGroup from '../models/user/UserToAccountAccessGroup.js'
import Wallet from '../models/Wallet.js'
import PaymentMean from '../models/PaymentMean.js'
import PaymentType from '../models/PaymentType.js'

await initDatabase()

const subProcess = 'createRoot'

await sequelize.transaction(async (transaction) => {
  // creater superAdmin access group

  const [superAdminAccountAccessGroup] = await AccessGroup.findOrCreate({
    where: { name: 'superAdmin' },
    transaction
  })

  // create root account

  const [rootAccount] = await Account.findOrCreate({
    where: { name: 'root' },
    defaults: {
      status: 'ok',
      data: {
        transports: {
          email: {
            api: 'smtp',
            from: process.env.ROOT_ACCOUNT_TRANSPORT_EMAIL_FROM,
            smtpHost: process.env.ROOT_ACCOUNT_TRANSPORT_EMAIL_SMTP_HOST,
            smtpPort: process.env.ROOT_ACCOUNT_TRANSPORT_EMAIL_SMTP_PORT,
            smtpUser: process.env.ROOT_ACCOUNT_TRANSPORT_EMAIL_SMTP_USER,
            smtpPassword: process.env.ROOT_ACCOUNT_TRANSPORT_EMAIL_SMTP_PASSWORD,
            smtpSecure: process.env.ROOT_ACCOUNT_TRANSPORT_EMAIL_SMTP_SECURE === 'true'
          }
        }
      }
    },
    transaction
  })

  // create root api key

  const secret = generateKey()
  const [rootApiKey, rootApiKeyCreated] = await AccountApiKey.findOrCreate({
    where: {
      accountId: rootAccount.accountId,
      name: 'root'
    },
    defaults: {
      keyHash: generateKeyHash(secret),
      accessGroupId: superAdminAccountAccessGroup.accessGroupId
    },
    transaction
  })

  // create super admin user

  const [superAdminUser, superAdminUserCreated] = await User.findOrCreate({
    where: {
      email: process.env.SUPERADMIN_USER_EMAIL
    },
    defaults: {
      firstName: 'Super',
      lastName: 'Admin',
      pseudo: 'SuperAdmin',
      passwordHash: generateKeyHash(process.env.SUPERADMIN_USER_PASSWORD),
      verified: true,
      braceletId: '1',
      isAssociatedBracelet: true
    },
    transaction
  })

  // Add super admin user to super admin access group for root account

  await UserToAccountAccessGroup.findOrCreate({
    where: {
      userId: superAdminUser.userId,
      accountId: null,
      accessGroupId: superAdminAccountAccessGroup.accessGroupId
    },
    transaction
  })

  const wallet = await Wallet.findOrCreate({
    where: {
      userId: superAdminUser.userId
    },
    transaction
  })

  const paymentType = await PaymentType.findOne({
    where: {
      type: 'Credit Card'
    },
    transaction
  })

  await PaymentMean.findOrCreate({
    where: {
      userId: superAdminUser.userId,
      walletId: wallet[0].walletId,
      paymentTypeId: paymentType.paymentTypeId,
      deleted: false,
      isDefault: true
    },
    transaction
  })

  return {
    rootAccount,
    rootApiKey,
    rootApiKeyCreated,
    superAdminUser,
    superAdminUserCreated
  }
})

await releaseDatabase()

logger.info({
  subProcess,
  msg: 'Ended successfully'
})
