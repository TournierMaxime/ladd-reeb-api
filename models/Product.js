/** @format */
import { DataTypes } from "sequelize";
import { sequelize } from "../lib/sequelize.js";
import Stock from "./Stock.js";

const Product = sequelize.define(
  "Product",
  {
    productId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    size: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Product",
    freezeTableName: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

Stock.belongsTo(Product, {
  foreignKey: "productId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Product.hasMany(Stock, {
  foreignKey: "productId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

export default Product;
