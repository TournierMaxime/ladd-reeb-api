import { Op } from 'sequelize'
import OrderProduct from '../models/OrderProduct.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { HttpBadRequestError, HttpNotFoundError } from '../lib/errors.js'

const searchOrderProduct = async (req, res) => {
  const { orderProductId, orderId, productId } = req.query
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

  if (orderProductId) {
    filters.push({
      orderProductId: {
        [Op.like]: `${orderProductId}%`
      }
    })
  }

  if (orderId) {
    filters.push({
      orderId: {
        [Op.like]: `${orderId}%`
      }
    })
  }

  if (productId) {
    filters.push({
      productId: {
        [Op.like]: `${productId}%`
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
    orderProduct: [['orderProductId', 'DESC']],
    include: [{ model: Order }, { model: Product }]
  }
  const count = await OrderProduct.count(options)
  const orderProducts = await OrderProduct.findAll(options)

  // Cas de succès
  res.status(200).json({
    orderProducts,
    items: orderProducts.length,
    results: count,
    currentPage: page,
    totalPages: Math.ceil(count / size)
  })
}

const createOrderProduct = async (req, res) => {
  const data = req.body
  const orderProduct = await OrderProduct.create({
    ...data
  })

  if (!data) {
    throw new HttpBadRequestError('Bad request')
  }

  res.status(201).json({
    message: 'OrderProduct created',
    orderProduct
  })
}

const getOneOrderProduct = async (req, res) => {
  const options = {
    where: { orderProductId: req.params.orderProductId }
  }
  const orderProduct = await OrderProduct.findOne(options)

  if (!orderProduct) {
    throw new HttpNotFoundError('OrderProduct not found')
  }

  res.status(200).json({
    orderProduct: [orderProduct]
  })
}

const putOrderProduct = async (req, res) => {
  const options = {
    where: { orderProductId: req.params.orderProductId }
  }
  const data = req.body
  const orderProduct = await OrderProduct.findOne(options)

  if (!data) {
    throw new HttpBadRequestError('Bad request')
  }

  if (!orderProduct) {
    throw new HttpNotFoundError('OrderProduct not found')
  }

  orderProduct.update({ ...data, orderProductId: req.params.orderProductId })

  res.status(201).json({
    message: 'OrderProduct updated',
    data: orderProduct
  })
}

const deleteOrderProduct = async (req, res) => {
  const options = { where: { orderProductId: req.params.orderProductId } }
  const orderProduct = await OrderProduct.findOne(options)

  if (!orderProduct) {
    throw new HttpNotFoundError('OrderProduct not found')
  }

  orderProduct.destroy()
  res.status(200).json({ message: 'OrderProduct has been deleted' })
}

export {
  searchOrderProduct,
  createOrderProduct,
  getOneOrderProduct,
  putOrderProduct,
  deleteOrderProduct
}
