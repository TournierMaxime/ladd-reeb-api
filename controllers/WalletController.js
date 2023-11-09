import { Op } from 'sequelize'
import Wallet from '../models/Wallet.js'
import PaymentMean from '../models/PaymentMean.js'
import PaymentType from '../models/PaymentType.js'
import { HttpBadRequestError, HttpNotFoundError } from '../lib/errors.js'

const searchWallet = async (req, res) => {
  const { walletId } = req.query
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

  if (walletId) {
    filters.push({
      walletId: {
        [Op.like]: `${walletId}%`
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
    wallet: [['walletId', 'DESC']]
  }
  const count = await Wallet.count(options)
  const wallets = await Wallet.findAll(options)

  // Cas de succès
  res.status(200).json({
    wallets,
    items: wallets.length,
    results: count,
    currentPage: page,
    totalPages: Math.ceil(count / size)
  })
}

const getOneWallet = async (req, res) => {
  const options = {
    where: { userId: req.params.userId },
    include: [
      {
        model: PaymentMean,
        include: [
          {
            model: PaymentType
          }
        ]
      }
    ]
  }

  const wallet = await Wallet.findOne(options)

  if (!wallet) {
    throw new HttpNotFoundError('Wallet not found')
  }

  res.status(200).json({
    wallet
  })
}

const putWallet = async (req, res) => {
  const options = {
    where: { userId: req.params.userId }
  }
  const data = req.body
  const wallet = await Wallet.findOne(options)

  if (!data) {
    throw new HttpBadRequestError('Bad request')
  }

  if (!wallet) {
    throw new HttpNotFoundError('Wallet not found')
  }

  wallet.update({ ...data, userId: req.params.userId })

  res.status(201).json({
    message: 'Wallet updated',
    data: wallet
  })
}

const deleteWallet = async (req, res) => {
  const options = { where: { userId: req.params.userId } }
  const wallet = await Wallet.findOne(options)

  if (!wallet) {
    throw new HttpNotFoundError('Wallet not found')
  }

  wallet.destroy()
  res.status(200).json({ message: 'Wallet has been deleted' })
}

export { searchWallet, getOneWallet, putWallet, deleteWallet }
