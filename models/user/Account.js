import { DataTypes } from 'sequelize'
import { sequelize } from '../../lib/sequelize.js'

const Account = sequelize.define(
  'Account',
  {
    accountId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    status: {
      type: DataTypes.ENUM('new', 'ok', 'ko'),
      defaultValue: 'new'
    },
    name: {
      type: DataTypes.STRING
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },

  {
    tableName: 'Account',
    freezeTableName: true
  }
)
export default Account
