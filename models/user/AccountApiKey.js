import { DataTypes } from "sequelize";
import Account from "./Account.js";
import AccessGroup from "./AccessGroup.js";
import { sequelize } from "../../lib/sequelize.js";

const AccountApiKey = sequelize.define(
  "AccountApiKey",
  {
    accountApiKeyId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    accessGroupId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    keyHash: {
      type: DataTypes.STRING,
    },
    expiresAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "AccountApiKey",
    freezeTableName: true,
  }
);
export default AccountApiKey;

Account.hasMany(AccountApiKey, {
  foreignKey: "accountId",
  onUpdate: "CASCADE",
});
AccountApiKey.belongsTo(Account, {
  foreignKey: "accountId",
  onUpdate: "CASCADE",
});

AccessGroup.hasMany(AccountApiKey, {
  foreignKey: "accessGroupId",
  onUpdate: "CASCADE",
});
AccountApiKey.belongsTo(AccessGroup, {
  foreignKey: "accessGroupId",
  onUpdate: "CASCADE",
});
