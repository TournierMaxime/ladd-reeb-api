import { Op } from 'sequelize'
import { HttpForbiddenError, HttpNotFoundError, HttpBadRequestError } from '../../lib/errors.js'
import Order from '../../models/Order.js'
import OrderProduct from '../../models/OrderProduct.js'
import User from '../../models/user/User.js'
import UserToAccountAccessGroup from '../../models/user/UserToAccountAccessGroup.js'
import Wallet from '../../models/Wallet.js'
import PaymentMean from '../../models/PaymentMean.js'

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
  const options = {
    where: { userId: req.params.userId },
    include: [
      {
        model: Order,
        include: {
          model: OrderProduct
        }
      },
      {
        model: Wallet
      },
      {
        model: PaymentMean
      }
    ]
  } // ajouter des attributs

  // TODO: doit gérer cet filtre en fonction du groupe d'accès de l'utilisateur, customer = accès qu'à lui même, admin/superAdmin accès aux autres
  if (req.userId !== req.params.userId) {
    throw new HttpForbiddenError()
  }

  const user = await User.findOne(options)

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

  const user = await User.findOne({ where: { userId } })

  const syncBracelet = 'Votre bracelet a bien été synchronisé avec votre compte'

  if (data.email && user.email !== data.email) {
    const existingUser = await User.findOne({ where: { email: data.email } })
    if (existingUser && existingUser.userId !== userId) {
      throw new HttpBadRequestError('Cet email est déjà associé à un compte')
    }
  }

  if (data.pseudo && user.pseudo !== data.pseudo) {
    const existingUser = await User.findOne({ where: { pseudo: data.pseudo } })
    if (existingUser && existingUser.userId !== userId) {
      throw new HttpBadRequestError('Pseudo déjà existant')
    }
  }

  if (!user) {
    throw new HttpNotFoundError('User not found')
  }

  if (data.braveletId && data.isAssocialtedBracelet) {
    user.update({ ...data, userId, syncBracelet })
  }

  user.update({ ...data, userId })

  res.status(201).json({ message: 'Profil mis à jour', syncBracelet })
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
