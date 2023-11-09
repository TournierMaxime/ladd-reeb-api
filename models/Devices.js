import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'

const Devices = sequelize.define(
  'Devices',
  {
    deviceId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('cashless', 'distributor', 'mobile')
    },
    macAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    geoloc: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'Devices',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false
  }
)

export default Devices
