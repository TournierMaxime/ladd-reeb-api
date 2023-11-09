import Product from '../models/Product.js'
import { Op } from 'sequelize'
import { HttpBadRequestError, HttpNotFoundError } from '../lib/errors.js'

const createProduct = async (req, res) => {
  const data = req.body
  const product = await Product.create({
    ...data
  })

  if (!data) {
    throw new HttpBadRequestError('Bad request')
  }

  res.status(201).json({
    message: 'Product created',
    data: product
  })
}

const getProduct = async (req, res, next) => {
  const options = {
    where: { productId: req.params.productId }
  }
  const product = await Product.findOne(options)

  if (!product) {
    throw new HttpNotFoundError('Product not found')
  }

  res.status(200).json({
    product
  })
}

const updateProduct = async (req, res) => {
  const options = {
    where: { productId: req.params.productId }
  }
  const data = req.body
  const product = await Product.findOne(options)

  if (!data) {
    throw new HttpBadRequestError('Bad request')
  }

  if (!product) {
    throw new HttpNotFoundError('Product not found')
  }

  product.update({ ...data, productId: req.params.productId })
  res.status(201).json({
    message: 'Product updated',
    product
  })
}

const deleteProduct = async (req, res) => {
  const options = { where: { productId: req.params.productId } }
  const product = await Product.findOne(options)

  if (!product) {
    throw new HttpNotFoundError('Product not found')
  }

  product.destroy()
  res.status(200).json({ message: 'Product has been deleted' })
}

const searchProduct = async (req, res) => {
  const { productId } = req.query
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

  if (productId) {
    filters.push({
      productId: {
        [Op.like]: `${productId}%`
      }
    })
  }

  const options = {
    where: {
      [Op.and]: filters
    },
    limit: size,
    offset: (page - 1) * size,
    order: [['productId', 'DESC']]
  }
  const count = await Product.count(options)
  const products = await Product.findAll(options)

  res.status(200).json({
    products,
    items: products.length,
    results: count,
    currentPage: page,
    totalPages: Math.ceil(count / size)
  })
}
export { createProduct, searchProduct, getProduct, updateProduct, deleteProduct }
