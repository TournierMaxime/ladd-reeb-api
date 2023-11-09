import { Op } from 'sequelize'
import PaymentType from '../models/PaymentType.js'
import { HttpNotFoundError } from '../lib/errors.js'

const searchPaymentType = async (req, res) => {
  const { paymentTypeId, type } = req.query

  const filters = []

  if (paymentTypeId) {
    filters.push({
      paymentTypeId: {
        [Op.like]: `${paymentTypeId}%`
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
    order: [['type', 'ASC']]
  }

  const paymentTypes = await PaymentType.findAll(options)

  // Cas de succès
  res.status(200).json({
    paymentTypes
  })
}

const getPaymentType = async (req, res) => {
  const options = {
    where: { paymentTypeId: req.params.paymentTypeId }
  }

  const paymentType = await PaymentType.findOne(options)

  if (!paymentType) {
    throw new HttpNotFoundError('PaymentType not found')
  }

  res.status(200).json({
    paymentType
  })
}

export { searchPaymentType, getPaymentType }
