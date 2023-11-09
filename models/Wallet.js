import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'
import User from './user/User.js'

const Wallet = sequelize.define(
  'Wallet',
  {
    walletId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    credits: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    tableName: 'Wallet',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false
  }
)

Wallet.belongsTo(User, {
  foreignKey: 'userId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

User.hasOne(Wallet, {
  foreignKey: 'userId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

export default Wallet
