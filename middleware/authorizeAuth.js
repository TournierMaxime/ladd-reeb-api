import jwt from 'jsonwebtoken'
import User from '../models/user/User.js'
import AccountApiKey from '../models/user/AccountApiKey.js'
import { compareKeyWithKeyHash } from '../lib/keys.js'
import expressAsyncHandler from 'express-async-handler'
import { HttpUnauthorizedError } from '../lib/errors.js'
import Account from '../models/user/Account.js'

const authorizeAuth = expressAsyncHandler(async (req, res, next) => {
  const laddAuthId = req.headers['x-ladd-auth-id']
  const laddAuthKey = req.headers['x-ladd-auth-key']
  const tokenDevices = req.cookies.access_token_devices

  if (laddAuthId && laddAuthKey) {
    const accountApiKey = await AccountApiKey.findOne({
      where: { accountApiKeyId: laddAuthId },
      include: [
        {
          model: Account,
          required: true
        }
      ]
    })

    if (!accountApiKey) { throw new HttpUnauthorizedError('accountApikey does not exit') }

    if (!compareKeyWithKeyHash(laddAuthKey, accountApiKey.keyHash)) {
      throw new HttpUnauthorizedError('Wrong key')
    }

    if (accountApiKey.expiredAt) {
      throw new HttpUnauthorizedError('Api key has expired')
    }
    if (accountApiKey.Account.status !== 'ok') {
      throw new HttpUnauthorizedError('Api key account is not active')
    }

    req.accountId = accountApiKey.accountId
    req.accountApiKeyId = accountApiKey.accountApiKeyId
  } else if (tokenDevices) {
    if (!tokenDevices) {
      throw new HttpUnauthorizedError('No cookie token given')
    }

    const data = jwt.verify(tokenDevices, process.env.JWT_DEVICE_SECRET)

    if (!data.userId) throw new HttpUnauthorizedError('Bad jwt token')

    req.userId = data.userId

    const user = await User.findOne({ where: { userId: req.userId } })

    if (!user) throw new HttpUnauthorizedError('User does not exit')

    if (!user.verified) throw new HttpUnauthorizedError('User not verified')
  } else {
    const token = req.cookies.access_token
    if (!token) {
      throw new HttpUnauthorizedError('No cookie token given')
    }
    const data = jwt.verify(token, process.env.JWT_COOKIE_SECRET)

    if (!data.userId) throw new HttpUnauthorizedError('Bad jwt token')

    req.userId = data.userId

    const user = await User.findOne({ where: { userId: req.userId } })

    if (!user) throw new HttpUnauthorizedError('User does not exit')

    if (!user.verified) throw new HttpUnauthorizedError('User not verified')
  }
  next()
})

export default authorizeAuth
