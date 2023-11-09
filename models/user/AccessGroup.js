import { DataTypes } from 'sequelize'
import { sequelize } from '../../lib/sequelize.js'

const AccessGroup = sequelize.define(
  'AccessGroup',
  {
    accessGroupId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'AccessGroup',
    freezeTableName: true
  }
)

export default AccessGroup
