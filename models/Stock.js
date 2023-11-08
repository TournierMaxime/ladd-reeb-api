/** @format */
import { DataTypes } from "sequelize";
import { sequelize } from "../lib/sequelize.js";

const Stock = sequelize.define(
  "Stock",
  {
    stockId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    machineId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "Stock",
    freezeTableName: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    indexes: [
      {
        unique: true,
        fields: ["machineId", "productId", "position"],
      },
    ],
  }
);

export default Stock;
