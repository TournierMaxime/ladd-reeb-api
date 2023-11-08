import { DataTypes } from "sequelize";
import { sequelize } from "../../lib/sequelize.js";
import AccessGroup from "./AccessGroup.js";
import Account from "./Account.js";
import User from "./User.js";

const UserToAccountAccessGroup = sequelize.define(
  "UserToAccountAccessGroup",
  {
    userToAccountAccessGroupId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    accountId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    accessGroupId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },

  {
    tableName: "UserToAccountAccessGroup",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["accountId", "userId"],
      },
    ],
  }
);

User.hasMany(UserToAccountAccessGroup, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
});
UserToAccountAccessGroup.belongsTo(User, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
});

Account.hasMany(UserToAccountAccessGroup, {
  foreignKey: "accountId",
  onUpdate: "CASCADE",
});
UserToAccountAccessGroup.belongsTo(Account, {
  foreignKey: "accountId",
  onUpdate: "CASCADE",
});

AccessGroup.hasMany(UserToAccountAccessGroup, {
  foreignKey: "accessGroupId",
  onUpdate: "CASCADE",
});
UserToAccountAccessGroup.belongsTo(AccessGroup, {
  foreignKey: "accessGroupId",
  onUpdate: "CASCADE",
});
export default UserToAccountAccessGroup;
