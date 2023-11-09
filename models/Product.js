import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'

const Product = sequelize.define(
  'Product',
  {
    productId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    size: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'Product',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false
  }
)

export default Product
