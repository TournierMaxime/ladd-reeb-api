/** @format */
import { DataTypes } from "sequelize";
import { sequelize } from "../lib/sequelize.js";
import Stock from "./Stock.js";

const Machine = sequelize.define(
  "Machine",
  {
    machineId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressMac: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Machine",
    freezeTableName: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

Stock.belongsTo(Machine, {
  foreignKey: "machineId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Machine.hasMany(Stock, {
  foreignKey: "machineId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

export default Machine;
