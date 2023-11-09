import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'
import User from './user/User.js'
import PaymentType from './PaymentType.js'
import Wallet from './Wallet.js'

const PaymentMean = sequelize.define(
  'PaymentMean',
  {
    paymentMeanId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    walletId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    paymentTypeId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted: {
      type: DataTypes.BOOLEAN
    },
    isDefault: {
      type: DataTypes.BOOLEAN
    }
  },
  {
    tableName: 'PaymentMean',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false
  }
)

PaymentMean.belongsTo(User, {
  foreignKey: 'userId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

User.hasMany(PaymentMean, {
  foreignKey: 'userId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

PaymentMean.belongsTo(PaymentType, {
  foreignKey: 'paymentTypeId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

PaymentType.hasMany(PaymentMean, {
  foreignKey: 'paymentTypeId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

PaymentMean.belongsTo(Wallet, {
  foreignKey: 'walletId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Wallet.hasMany(PaymentMean, {
  foreignKey: 'walletId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

export default PaymentMean
