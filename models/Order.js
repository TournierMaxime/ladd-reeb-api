/** @format */
import { DataTypes } from "sequelize";
import { sequelize } from "../lib/sequelize.js";
import User from "./user/User.js";

const Order = sequelize.define(
  "Order",
  {
    orderId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    orderStatus: {
      type: DataTypes.ENUM("en cours", "validée", "payée"),
      defaultValue: "en cours",
      allowNull: false,
    },
  },
  {
    tableName: "Order",
    freezeTableName: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

Order.belongsTo(User, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

User.hasMany(Order, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

export default Order;
