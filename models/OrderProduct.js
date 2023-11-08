/** @format */
import { DataTypes } from "sequelize";
import { sequelize } from "../lib/sequelize.js";
import Order from "./Order.js";
import Product from "./Product.js";

const OrderProduct = sequelize.define(
  "OrderProduct",
  {
    orderProductId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "OrderProduct",
    freezeTableName: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    indexes: [
      {
        unique: true,
        fields: ["orderId", "productId"],
      },
    ],
  }
);

OrderProduct.belongsTo(Product, {
  foreignKey: "productId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Product.hasMany(OrderProduct, {
  foreignKey: "productId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

OrderProduct.belongsTo(Order, {
  foreignKey: "orderId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Order.hasMany(OrderProduct, {
  foreignKey: "orderId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

export default OrderProduct;
