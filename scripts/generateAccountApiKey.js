import { generateKey, generateKeyHash } from '../lib/keys.js'
import { logger } from '../lib/logger.js'
import { initDatabase, releaseDatabase } from '../lib/sequelize.js'
import AccessGroup from '../models/user/AccessGroup.js'
import Account from '../models/user/Account.js'
import AccountApiKey from '../models/user/AccountApiKey.js'

await initDatabase()

const subProcess = 'generateAccountApiKey'
const args = process.argv.slice(2)

try {
  const accountId = args[0] ?? null
  const keyName = args[1] ?? null

  if (!accountId) {
    throw new Error('Account ID not provided')
  }

  if (!keyName) {
    throw new Error('Key name not provided')
  }

  const account = await Account.findByPk(accountId)

  if (!account) {
    throw new Error(`Account ${accountId} not found`)
  }

  const adminAccessGroup = await AccessGroup.findOne({ where: { name: 'admin' } })

  if (!adminAccessGroup) {
    throw new Error('Admin access group not found')
  }

  const secret = generateKey()

  const [rootApiKey, rootApiKeyCreated] = await AccountApiKey.findOrCreate({
    where: {
      accountId: account.accountId,
      name: keyName
    },
    defaults: {
      keyHash: generateKeyHash(secret),
      accessGroupId: adminAccessGroup.accessGroupId
    }
  })

  if (rootApiKeyCreated) {
    logger.info({ subProcess, msg: `API Key ${rootApiKey.accountApiKeyId} created for account ${accountId}, with secret ${secret}` })
  }
} catch (err) {
  logger.error({
    subProcess,
    errClass: err.constructor.name,
    errMsg: err.message,
    errStack: err.stack
  })
}

await releaseDatabase()
