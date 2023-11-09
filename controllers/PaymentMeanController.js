import { Op } from 'sequelize'
import PaymentMean from '../models/PaymentMean.js'
import { HttpNotFoundError, HttpBadRequestError } from '../lib/errors.js'

const searchPaymentMean = async (req, res) => {
  const { paymentMeanId, type } = req.query
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

  if (paymentMeanId) {
    filters.push({
      paymentMeanId: {
        [Op.like]: `${paymentMeanId}%`
      }
    })
  }

  if (type) {
    filters.push({
      type: {
        [Op.like]: `${type}%`
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
    order: [['type', 'ASC']]
  }
  const count = await PaymentMean.count(options)
  const paymentMeans = await PaymentMean.findAll(options)

  // Cas de succès
  res.status(200).json({
    paymentMeans,
    items: paymentMeans.length,
    results: count,
    currentPage: page,
    totalPages: Math.ceil(count / size)
  })
}

const createPaymentMean = async (req, res) => {
  const data = req.body
  const paymentMean = await PaymentMean.create({
    ...data
  })

  if (!data) {
    throw new HttpBadRequestError('Bad request')
  }

  res.status(201).json({
    message: 'PaymentMean created',
    paymentMean
  })
}

const getPaymentMean = async (req, res) => {
  const options = {
    where: { paymentMeanId: req.params.paymentMeanId }
  }

  const paymentMean = await PaymentMean.findOne(options)

  if (!paymentMean) {
    throw new HttpNotFoundError('PaymentMean not found')
  }

  res.status(200).json({
    paymentMean
  })
}

export { searchPaymentMean, createPaymentMean, getPaymentMean }
