import expressAsyncHandler from 'express-async-handler'
import { HttpForbiddenError } from '../lib/errors.js'
import AccessGroup from '../models/user/AccessGroup.js'
import AccessGroupRule from '../models/user/AccessGroupRule.js'
import Account from '../models/user/Account.js'
import AccountApiKey from '../models/user/AccountApiKey.js'
import UserToAccountAccessGroup from '../models/user/UserToAccountAccessGroup.js'

const checkAccessRule = (rule) => {
  return expressAsyncHandler(async (req, res, next) => {
    const accountId = req.params.accountId
    const userId = req.userId
    const accountApiKeyId = req.accountApiKeyId

    if (userId) {
      // check super admin group
      const checkSuperAdmin = await UserToAccountAccessGroup.findOne({
        where: { accountId: null, userId },

        include: [
          {
            model: AccessGroup,
            required: true,
            include: [
              {
                model: AccessGroupRule,
                where: { rule },
                required: true
              }
            ]
          }
        ]
      })

      if (checkSuperAdmin) {
        return next()
      }
      let accounts = []
      // check avec un account
      if (accountId) {
        accounts = await Account.findOne({
          include: [
            {
              model: UserToAccountAccessGroup,
              where: { accountId, userId },
              required: true,
              include: [
                {
                  model: AccessGroup,
                  required: true,
                  include: [
                    {
                      model: AccessGroupRule,
                      where: { rule },
                      required: true
                    }
                  ]
                }
              ]
            }
          ]
        })
      } else {
        // liste des comptes pour le permission
        accounts = await Account.findAll({
          include: [
            {
              model: UserToAccountAccessGroup,
              required: true,
              where: { userId },
              include: [
                {
                  model: AccessGroup,
                  required: true,
                  include: [
                    {
                      model: AccessGroupRule,
                      required: true,
                      where: { rule }
                    }
                  ]
                }
              ]
            }
          ]
        })
      }
      // stock les liste auquel on access
      req.accounts = accounts
      if (req.accounts.length > 0) {
        return next()
      }
    }

    if (accountApiKeyId) {
      const checkApiKey = await AccountApiKey.findByPk(accountApiKeyId, {
        include: [
          {
            model: Account,
            required: true
          },
          {
            model: AccessGroup,
            required: true,
            include: [
              {
                model: AccessGroupRule,
                required: true,
                where: { rule }
              }
            ]
          }
        ]
      })

      if (checkApiKey) {
        req.accounts = [checkApiKey.Account]
        return next()
      }
    }

    throw new HttpForbiddenError(
      'You do not have permission to access this resource'
    )
  })
}

export default checkAccessRule
