import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'

const PaymentType = sequelize.define(
  'PaymentType',
  {
    paymentTypeId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'PaymentType',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false
  }
)

export default PaymentType
