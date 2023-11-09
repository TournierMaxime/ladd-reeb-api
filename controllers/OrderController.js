import { Op } from 'sequelize'
import Order from '../models/Order.js'
import OrderProduct from '../models/OrderProduct.js'
import User from '../models/user/User.js'
import PaymentMean from '../models/PaymentMean.js'
import { HttpBadRequestError, HttpNotFoundError, HttpUnauthorizedError } from '../lib/errors.js'
import { sequelize } from '../lib/sequelize.js'
import { createAnonymousUser } from '../lib/users.js'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import Wallet from '../models/Wallet.js'

const searchOrder = async (req, res) => {
  const { orderId, userId } = req.query
  // Pagination
  const pageAsNumber = Number(req.query.page)
  const sizeAsNumber = Number(req.query.size)
  let page = 1
  let size = 50

  if (!Number.isNaN(pageAsNumber) && pageAsNumber >= 0) {
    page = pageAsNumber
  }

  if (
    !Number.isNaN(sizeAsNumber) &&
      sizeAsNumber > 0 &&
      sizeAsNumber <= 500
  ) {
    size = sizeAsNumber
  }
  const filters = []

  if (orderId) {
    filters.push({
      orderId: {
        [Op.like]: `${orderId}%`
      }
    })
  }

  if (userId) {
    filters.push({
      userId: {
        [Op.like]: `${userId}%`
      }
    })
  }
  // Datas
  const options = {
    where: {
      [Op.and]: filters
    },
    limit: size,
    offset: (page - 1) * size,
    order: [['orderId', 'DESC']],
    include: [{ model: User }]
  }
  const count = await Order.count(options)
  const orders = await Order.findAll(options)

  // Cas de succès
  res.status(200).json({
    orders,
    items: orders.length,
    results: count,
    currentPage: page,
    totalPages: Math.ceil(count / size)
  })
}

const createOrder = async (req, res) => {
  const { items, ...orderData } = req.body

  let user
  let token

  if (!orderData) {
    throw new HttpBadRequestError('orderData missing')
  }
  if (!Array.isArray(items)) {
    throw new HttpBadRequestError('items is not an array')
  }

  const result = await sequelize.transaction(async (t) => {
    if (!orderData.userId) {
      user = await createAnonymousUser()
      orderData.userId = user.userId

      await User.findOne({
        where: { userId: user.userId },
        attributes: [
          'userId',
          'braceletId',
          'isAssociatedBracelet',
          'email',
          'pseudo',
          'firstName',
          'lastName',
          'verified'
        ]
      })
      if (!user) throw new HttpNotFoundError('User does not exist')
      if (!user.verified) throw new HttpUnauthorizedError('User not verified')

      if (user.userId) {
        token = jwt.sign({ userId: user.userId }, process.env.JWT_DEVICE_SECRET)
      }
      const expirationDate = moment().add(1, 'month')

      res.cookie('access_token_devices', token, {
        expires: expirationDate.toDate(),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      })

      /*       res.status(200).json({
        user,
        token
      }) */
    }

    // Création de la commande
    const order = await Order.create(orderData, { transaction: t })

    // Création des produits de commande
    const orderProducts = items.map(item => ({
      orderId: order.orderId,
      data: item
    }))
    await OrderProduct.bulkCreate(orderProducts, { transaction: t })

    // Récupération des produits de commande créés
    const createdOrderProducts = await OrderProduct.findAll({
      where: { orderId: order.orderId },
      transaction: t
    })

    return { order, orderProducts: createdOrderProducts }
  })

  res.status(201).json({
    message: 'Order created',
    order: result.order,
    orderProducts: result.orderProducts,
    user,
    token
  })
}

const getOneOrder = async (req, res) => {
  const options = {
    where: { orderId: req.params.orderId },
    include: [
      { model: OrderProduct },
      { model: PaymentMean },
      {
        model: User,
        attributes: ['userId', 'email'],
        include: {
          model: Wallet,
          attributes: ['walletId']
        }
      }
    ]
  }

  const order = await Order.findOne(options)

  if (!order) {
    throw new HttpNotFoundError('Order not found')
  }

  res.status(200).json({
    order
  })
}

const putOrder = async (req, res) => {
  const options = {
    where: { orderId: req.params.orderId }
  }
  const data = req.body
  const order = await Order.findOne(options)

  if (!data) {
    throw new HttpBadRequestError('Bad request')
  }

  if (!order) {
    throw new HttpNotFoundError('Order not found')
  }

  order.update({ ...data, orderId: req.params.orderId })

  res.status(201).json({
    message: 'Order updated',
    data: order
  })
}

const deleteOrder = async (req, res) => {
  const options = { where: { orderId: req.params.orderId } }
  const order = await Order.findOne(options)

  if (!order) {
    throw new HttpNotFoundError('Order not found')
  }

  order.destroy()
  res.status(200).json({ message: 'Order has been deleted' })
}

export { searchOrder, createOrder, getOneOrder, putOrder, deleteOrder }
