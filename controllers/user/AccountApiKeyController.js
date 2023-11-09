import Account from '../../models/user/Account.js'
import AccountApiKey from '../../models/user/AccountApiKey.js'
import { Op } from 'sequelize'
import { generateKey, generateKeyHash } from '../../lib/keys.js'
import { HttpNotFoundError } from '../../lib/errors.js'

// mettre a jour le transport "sms" & "email"
const updateTransport = async (req, res) => {
  // variable pour specifier le params qu'on recupere
  const accountId = req.params.accountId
  const transport = req.params.transport
  const data = req.body

  const account = await Account.findOne({ where: { accountId } })

  if (!account.data) account.data = {}

  if (!account.data.transports) account.data.transports = {}

  account.data.transports[transport] = data

  account.save()

  res.status(201).json({})
}

const createApiKey = async (req, res) => {
  if (req.account.name !== 'root') throw new Error('Forbidden')
  const name = req.body.name

  const accountId = req.params.accountId
  const accessGroupId = req.params.accessGroupId

  const key = generateKey()

  const accountApiKey = await AccountApiKey.create({
    name,
    accountId,
    accessGroupId,
    keyHash: generateKeyHash(key)
  })

  res.status(201).json({
    key,
    accountApiKey
  })
}

const searchApiKeys = async (req, res) => {
  const accountId = req.params.accountId
  const account = await Account.findOne({
    where: { accountId }
  })

  if (!account) {
    throw new HttpNotFoundError('Account not found')
  }

  // Extract search criteria from the request body
  const { name } = req.body

  // Find API keys that match the search criteria
  const apiKeyList = await AccountApiKey.findAll({
    where: {
      accountId: account.accountId,
      name: { [Op.like]: `%${name}%` }
    }
  })

  // Return the found API keys
  return res.send({
    apiKeyList
  })
}

const updateApiKey = async (req, res) => {
  const accountId = req.params.accountId
  const accountApiKeyId = req.params.accountApiKeyId

  const data = req.body

  const apiKey = await AccountApiKey.findOne({
    where: {
      accountId,
      accountApiKeyId
    }
  })

  if (!apiKey) {
    throw new HttpNotFoundError('API key not found')
  }

  await AccountApiKey.update({ ...data, accountApiKeyId })

  return res.status(200).json({})
}

const deleteApiKey = async (req, res) => {
  const accountId = req.params.accountId
  const accountApiKeyId = req.params.accountApiKeyId

  const apiKey = await AccountApiKey.findOne({
    where: {
      accountId,
      accountApiKeyId
    }
  })

  if (!apiKey) {
    throw new HttpNotFoundError('API key not found')
  }

  await apiKey.destroy()

  return res.send({})
}

export {
  updateTransport,
  updateApiKey,
  createApiKey,
  deleteApiKey,
  searchApiKeys
}
