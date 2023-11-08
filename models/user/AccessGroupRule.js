import { DataTypes } from "sequelize";
import { sequelize } from "../../lib/sequelize.js";
import AccessGroup from "./AccessGroup.js";

const AccessGroupRule = sequelize.define(
  "AccessGroupRule",
  {
    accessGroupRuleId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    accessGroupId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    rule: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "AccessGroupRule",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["accessGroupId", "rule"],
      },
    ],
  }
);

// CASCADE update
AccessGroup.hasMany(AccessGroupRule, {
  foreignKey: "accessGroupId",
  onUpdate: "CASCADE",
});
AccessGroupRule.belongsTo(AccessGroup, {
  foreignKey: "accessGroupId",
  onUpdate: "CASCADE",
});

export default AccessGroupRule;
