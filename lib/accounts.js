import Account from '../models/user/Account.js'

async function getRootAccount () {
  const rootAccount = await Account.findOne({ where: { name: 'root' } })

  if (!rootAccount) {
    throw new Error('Root account does not exist')
  }

  return rootAccount
}

export { getRootAccount }
