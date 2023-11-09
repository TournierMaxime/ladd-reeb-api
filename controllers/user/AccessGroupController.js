import { Op } from 'sequelize'
import { HttpNotFoundError } from '../../lib/errors.js'
import AccessGroup from '../../models/user/AccessGroup.js'

const createAccessGroup = async (req, res) => {
  const data = req.body
  const accessGroup = await AccessGroup.create(data)

  res.status(201).json({
    accessGroup
  })
}

const searchAccessGroup = async (req, res) => {
  const { accessGroupId, name } = req.query
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
  const filters = []

  if (accessGroupId) {
    filters.push({
      accessGroupId: {
        [Op.like]: `${accessGroupId}%`
      }
    })
  }
  if (name) {
    filters.push({
      name: {
        [Op.like]: `${name}%`
      }
    })
  }
  const options = {
    where: {
      [Op.and]: filters
    },
    limit: size,
    offset: (page - 1) * size,
    order: [['accessGroupId', 'DESC']]
  }
  const count = await AccessGroup.count()
  const accessGroupList = await AccessGroup.findAll(options)

  // Cas de succès
  res.status(201).json({
    accessGroupList,
    items: accessGroupList.length,
    results: count,
    currentPage: page,
    totalPages: Math.ceil(count / size)
  })
}

const getOneAccessGroup = async (req, res) => {
  const accessGroupId = req.params.accessGroupId

  const accessGroup = await AccessGroup.findOne({
    where: { accessGroupId }
  })

  if (!accessGroup) {
    throw new HttpNotFoundError('Access group not found')
  }

  res.status(200).json({
    accessGroup
  })
}

const putAccessGroup = async (req, res) => {
  const accessGroupId = req.params.accessGroupId
  const data = req.body

  const accessGroup = await AccessGroup.findOne({
    where: { accessGroupId }
  })

  accessGroup.update({ ...data, accessGroupId })

  res.status(201).json({})
}

export {
  createAccessGroup,
  getOneAccessGroup,
  searchAccessGroup,
  putAccessGroup
}
