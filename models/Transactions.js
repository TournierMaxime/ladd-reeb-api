import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'
import Order from './Order.js'
import PaymentMean from './PaymentMean.js'
import Devices from './Devices.js'
import Wallet from './Wallet.js'
import PaymentType from './PaymentType.js'

const Transactions = sequelize.define(
  'Transactions',
  {
    transactionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    paymentTypeId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    paymentMeanId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    deviceId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    walletId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    },
    acceptedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'Transactions',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false
  }
)

Transactions.belongsTo(Order, {
  foreignKey: 'orderId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Order.hasMany(Transactions, {
  foreignKey: 'orderId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Transactions.belongsTo(PaymentType, {
  foreignKey: 'paymentTypeId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

PaymentType.hasMany(Transactions, {
  foreignKey: 'paymentTypeId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Transactions.belongsTo(PaymentMean, {
  foreignKey: 'paymentMeanId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

PaymentMean.hasMany(Transactions, {
  foreignKey: 'paymentMeanId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Transactions.belongsTo(Devices, {
  foreignKey: 'deviceId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Devices.hasMany(Transactions, {
  foreignKey: 'deviceId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Transactions.belongsTo(Wallet, {
  foreignKey: 'walletId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Wallet.hasMany(Transactions, {
  foreignKey: 'walletId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

export default Transactions
