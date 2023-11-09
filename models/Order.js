import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'
import User from './user/User.js'
import PaymentMean from './PaymentMean.js'

const Order = sequelize.define(
  'Order',
  {
    orderId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    paymentMeanId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    orderReference: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    orderStatus: {
      type: DataTypes.ENUM('pending', 'failed', 'completed', 'delivered'),
      defaultValue: 'pending'
    }
  },
  {
    timestamps: true,
    tableName: 'Order',
    freezeTableName: true,
    createdAt: 'createdAt',
    hooks: {
      beforeCreate: async (order, options) => {
        const latestOrder = await Order.findOne({
          order: [['orderReference', 'DESC']]
        })
        order.orderReference = latestOrder ? latestOrder.orderReference + 1 : 1
      }
    }
  }
)

Order.belongsTo(User, {
  foreignKey: 'userId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

User.hasMany(Order, {
  foreignKey: 'userId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

PaymentMean.hasOne(Order, {
  foreignKey: 'paymentMeanId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Order.belongsTo(PaymentMean, {
  foreignKey: 'paymentMeanId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

export default Order
