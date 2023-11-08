/** @format */

import dotenv from "dotenv";
dotenv.config();
import Product from "../models/Product.js";
import { Op } from "sequelize";

const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const product = await Product.create({
      ...data,
    });
    //Cas de succès
    res.status(201).json({
      message: "Product created",
      data: product,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const getProduct = async (req, res, next) => {
  try {
    const options = {
      where: { productId: req.params.productId },
    };
    const products = await Product.findOne(options);
    res.status(200).json({
      data: products,
    });
  } catch (error) {
    res.status(404).json({ error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const options = {
      where: { productId: req.params.productId },
    };
    const data = req.body;
    const product = await Product.findOne(options);
    product.update({ ...data, productId: req.params.productId });
    res.status(201).json({
      message: "Product updated",
      data: product,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const options = { where: { productId: req.params.productId } };
    const product = await Product.findOne(options);
    product.destroy();
    res.status(200).json({ message: "Product has been deleted" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const searchProduct = async (req, res) => {
  try {
    const { productId } = req.query;
    //Pagination
    const pageAsNumber = Number(req.query.page);
    const sizeAsNumber = Number(req.query.size);
    let page = 1;
    let size = 50;

    if (!Number.isNaN(pageAsNumber) && pageAsNumber >= 0) {
      page = pageAsNumber;
    }

    if (
      !Number.isNaN(sizeAsNumber) &&
      sizeAsNumber > 0 &&
      sizeAsNumber <= 500
    ) {
      size = sizeAsNumber;
    }
    const filters = [];

    if (productId) {
      filters.push({
  productId: {
          [Op.like]: `${productId}%`,
        },
      });
    }
    
    //Datas
    const options = {
      where: {
        [Op.and]: filters,
      },
      limit: size,
      offset: (page - 1) * size,
      order: [["productId", "DESC"]],
    };
    const count = await Product.count(options);
    const products = await Product.findAll(options);

    //Cas de succès
    res.status(200).json({
      products,
      items: products.length,
      results: count,
      currentPage: page,
      totalPages: Math.ceil(count / size),
    });
  } catch (error) {
    res.status(400).json({
      msg: "error " + error.message,
    });
  }
};
export { createProduct, searchProduct, getProduct, updateProduct, deleteProduct };
