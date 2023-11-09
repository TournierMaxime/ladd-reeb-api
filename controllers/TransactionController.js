import { Op } from 'sequelize'
import Order from '../models/Order.js'
import Transactions from '../models/Transactions.js'
import PaymentMean from '../models/PaymentMean.js'
import { HttpBadRequestError, HttpNotFoundError } from '../lib/errors.js'
import { sequelize } from '../lib/sequelize.js'
import Devices from '../models/Devices.js'

const searchTransaction = async (req, res) => {
  const { transactionId } = req.query
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

  if (transactionId) {
    filters.push({
      transactionId: {
        [Op.like]: `${transactionId}%`
      }
    })
  }

  const options = {
    where: {
      [Op.and]: filters
    },
    limit: size,
    offset: (page - 1) * size,
    orderProduct: [['transactionId', 'DESC']],
    include: [{ model: Order }]
  }
  const count = await Transactions.count(options)
  const transactions = await Transactions.findAll(options)

  // Cas de succès
  res.status(200).json({
    transactions,
    items: transactions.length,
    results: count,
    currentPage: page,
    totalPages: Math.ceil(count / size)
  })
}

const createTransaction = async (req, res) => {
  const { dataDevice, ...data } = req.body

  if (!data) {
    throw new HttpBadRequestError('Bad request')
  }

  const result = await sequelize.transaction(async (t) => {
    const device = await Devices.findOrCreate({
      where: {
        macAddress: dataDevice.macAddress
      },
      defaults: {
        ...dataDevice,
        geoloc: req.headers['x-forwarded-for']
      },
      transaction: t
    })

    const transaction = await Transactions.create({ ...data, deviceId: device.deviceId }, { transaction: t })
    return { transaction }
  })

  res.status(201).json({
    message: 'Transaction created',
    transaction: result.transaction
  })
}

const createTransactionCashless = async (req, res) => {
  const { dataDevice, ...data } = req.body

  if (!data) {
    throw new HttpBadRequestError('Bad request')
  }

  const result = await sequelize.transaction(async (t) => {
    const device = await Devices.findOrCreate({
      where: {
        macAddress: dataDevice.macAddress
      },
      defaults: {
        ...dataDevice,
        geoloc: req.headers['x-forwarded-for']
      },
      transaction: t
    })

    const transaction = await Transactions.create({ ...data, deviceId: device.deviceId }, { transaction: t })

    return { transaction }
  })

  res.status(201).json({
    message: 'Transaction created',
    transaction: result.transaction
  })
}

const getOneTransaction = async (req, res) => {
  const options = {
    where: { transactionId: req.params.transactionId },
    include: { model: PaymentMean }
  }
  const transaction = await Transactions.findOne(options)

  if (!transaction) {
    throw new HttpNotFoundError('Transaction not found')
  }

  res.status(200).json({
    transaction
  })
}

const updateTransaction = async (req, res) => {
  const options = {
    where: { transactionId: req.params.transactionId }
  }
  const data = req.body
  const transaction = await Transactions.findOne(options)

  const success = 'Paiement réalisé avec succès'
  const error = 'Echec du paiement'

  if (!data) {
    throw new HttpBadRequestError('Bad request')
  }

  if (!transaction) {
    throw new HttpNotFoundError('Transaction not found')
  }

  if (data.status === 'accepted') {
    transaction.update({ ...data, transactionId: req.params.transactionId, success })
  } else if (data.status === 'rejected') {
    transaction.update({ ...data, transactionId: req.params.transactionId, error })
  }

  res.status(201).json({
    message: 'Transaction updated',
    transaction,
    success,
    error
  })
}

const deleteTransaction = async (req, res) => {
  const options = { where: { transactionId: req.params.transactionId } }
  const transaction = await Transactions.findOne(options)

  if (!transaction) {
    throw new HttpNotFoundError('Transaction not found')
  }

  transaction.destroy()
  res.status(200).json({ message: 'Transaction has been deleted' })
}

export {
  searchTransaction,
  createTransaction,
  createTransactionCashless,
  getOneTransaction,
  updateTransaction,
  deleteTransaction
}
