import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'
import Order from './Order.js'

const OrderProduct = sequelize.define(
  'OrderProduct',
  {
    orderProductId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },
  {
    tableName: 'OrderProduct',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false
  }
)

OrderProduct.belongsTo(Order, {
  foreignKey: 'orderId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Order.hasMany(OrderProduct, {
  foreignKey: 'orderId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

export default OrderProduct
