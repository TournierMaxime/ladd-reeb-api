import AccessGroup from '../models/user/AccessGroup.js'
import AccessGroupRule from '../models/user/AccessGroupRule.js'
import { initDatabase, releaseDatabase, sequelize } from '../lib/sequelize.js'
import { logger } from '../lib/logger.js'

await initDatabase()

await sequelize.transaction(async (transaction) => {
  const [superAdminGroup] = await AccessGroup.findOrCreate({
    where: { name: 'superAdmin' },
    transaction
  })

  // Crée le groupe d'accès 'admin'
  const [adminGroup] = await AccessGroup.findOrCreate({
    where: { name: 'admin' },
    transaction
  })

  // Crée le groupe d'accès 'customer'
  const [customerGroup] = await AccessGroup.findOrCreate({
    where: { name: 'customer' },
    transaction
  })

  const groups = [
    {
      accessGroupId: superAdminGroup.accessGroupId,
      rules: [
        'api/write',
        'api/read',
        'accounts/read',
        'accounts/write',
        'users/read',
        'users/write',
        'messages/write',
        'messages/read',
        'access-groups/write',
        'access-groups/read',
        'user-to-account/write',
        'user-to-account/read'
      ]
    },
    {
      accessGroupId: adminGroup.accessGroupId,
      rules: [
        'api/write',
        'api/read',
        'accounts/read',
        'accounts/write',
        'users/read',
        'users/write',
        'messages/write',
        'messages/read',
        'access-groups/write',
        'access-groups/read',
        'user-to-account/write',
        'user-to-account/read'
      ]
    },
    {
      accessGroupId: customerGroup.accessGroupId,
      rules: [
        'api/read',
        'accounts/read',
        'users/read',
        'users/write',
        'messages/read',
        'access-groups/read',
        'user-to-account/read'
      ]
    }
  ]

  for (const group of groups) {
    const groupRules = group.rules.map((rule) => ({
      rule,
      accessGroupId: group.accessGroupId
    }))

    await AccessGroupRule.bulkCreate(groupRules, {
      ignoreDuplicates: true,
      transaction
    })
  }
})

logger.info({
  subProcess: 'createAccessGroupRules',
  msg: 'Access groups rules created'
})

await releaseDatabase()
