import { DataTypes } from 'sequelize'
import { sequelize } from '../../lib/sequelize.js'

const User = sequelize.define(
  'User',
  {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pseudo: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    braceletId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isAssociatedBracelet: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    forgetPassword: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: true,
    tableName: 'User',
    freezeTableName: true,
    createdAt: 'created'
  }
)
export default User
