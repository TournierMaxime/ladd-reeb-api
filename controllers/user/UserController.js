import { Op } from 'sequelize'
import { HttpForbiddenError, HttpNotFoundError } from '../../lib/errors.js'
import User from '../../models/user/User.js'
import UserToAccountAccessGroup from '../../models/user/UserToAccountAccessGroup.js'

const searchUsers = async (req, res) => {
  const accounts = req.accounts

  const { userId, email, firstName, lastName } = req.query
  // Pagination
  const pageAsNumber = Number(req.query.page)
  const sizeAsNumber = Number(req.query.size)
  let page = 1
  let size = 50

  if (!Number.isNaN(pageAsNumber) && pageAsNumber >= 0) {
    page = pageAsNumber
  }

  if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber <= 500) {
    size = sizeAsNumber
  }

  // TODO: doit gérer cet filtre en fonction du groupe d'accès de l'utilisateur, customer = accès qu'à lui même, admin/superAdmin accès aux autres
  if (req.userId !== userId) {
    throw new HttpForbiddenError()
  }

  const filters = []

  if (userId) {
    filters.push({
      userId: {
        [Op.like]: `${userId}%`
      }
    })
  }
  if (email) {
    filters.push({
      email: {
        [Op.like]: `${email}%`
      }
    })
  }

  if (firstName) {
    filters.push({
      firstName: {
        [Op.like]: `${firstName}%`
      }
    })
  }
  if (lastName) {
    filters.push({
      lastName: {
        [Op.like]: `${lastName}%`
      }
    })
  }

  const options = {
    where: {
      [Op.and]: filters
    },

    limit: size,
    offset: (page - 1) * size,
    order: [['userId', 'DESC']]
  }
  if (accounts) {
    options.include = [
      {
        model: UserToAccountAccessGroup,
        where: { accountId: { [Op.in]: accounts.map((a) => a.accountId) } },
        required: true
      }
    ]
  }
  const count = await User.count()
  const userList = await User.findAll(options)
  res.status(200).json({
    userList,
    items: userList.length,
    results: count,
    currentPage: page,
    totalPages: Math.ceil(count / size)
  })
}

const getUser = async (req, res) => {
  const userId = req.params.userId

  // TODO: doit gérer cet filtre en fonction du groupe d'accès de l'utilisateur, customer = accès qu'à lui même, admin/superAdmin accès aux autres
  if (req.userId !== userId) {
    throw new HttpForbiddenError()
  }

  const user = await User.findByPk(userId)

  if (!user) {
    throw new HttpNotFoundError('User not found')
  }

  res.status(200).json({
    user
  })
}

const updateUser = async (req, res) => {
  const userId = req.params.userId

  // TODO: doit gérer cet filtre en fonction du groupe d'accès de l'utilisateur, customer = accès qu'à lui même, admin/superAdmin accès aux autres
  if (req.userId !== userId) {
    throw new HttpForbiddenError()
  }

  const data = req.body

  const user = await User.findByPk(userId)

  if (!user) {
    throw new HttpNotFoundError('User not found')
  }

  user.update({ ...data, userId })

  res.status(201).json({})
}

const deleteUser = async (req, res) => {
  const userId = req.params.userId

  const user = await User.findByPk(userId)

  // TODO: doit gérer cet filtre en fonction du groupe d'accès de l'utilisateur, customer = accès qu'à lui même, admin/superAdmin accès aux autres
  if (req.userId !== userId) {
    throw new HttpForbiddenError()
  }

  if (!user) {
    throw new HttpNotFoundError('User not found')
  }

  user.destroy()

  res.status(200).json({})
}
export { searchUsers, getUser, updateUser, deleteUser }
