import { Op } from "sequelize";
import Stock from "../models/Stock.js";
import Machine from "../models/Machine.js";
import Product from "../models/Product.js";

const searchStock = async (req, res) => {
  try {
    const { stockId, machineId, productId } = req.query;
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

    if (stockId) {
      filters.push({
        stockId: {
          [Op.like]: `${stockId}%`,
        },
      });
    }

    if (machineId) {
      filters.push({
        machineId: {
          [Op.like]: `${machineId}%`,
        },
      });
    }

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
      stock: [["stockId", "DESC"]],
      include: [{ model: Machine }],
      include: [{ model: Product }],
    };
    const count = await Stock.count(options);
    const stocks = await Stock.findAll(options);

    //Cas de succès
    res.status(200).json({
      stocks,
      items: stocks.length,
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

const createStock = async (req, res) => {
  try {
    const data = req.body;
    const stock = await Stock.create({
      ...data,
    });
    res.status(201).json({
      message: "Stock created",
      data: stock,
    });
  } catch (error) {
    res.status(400).json({
      msg: "error " + error.message,
    });
  }
};

const getOneStock = async (req, res) => {
  try {
    const options = {
      where: { stockId: req.params.stockId },
    };
    const stock = await Stock.findOne(options);
    res.status(200).json({
      data: stock,
    });
  } catch (error) {
    res.status(404).json({ error });
  }
};

const putStock = async (req, res) => {
  try {
    const options = {
      where: { stockId: req.params.stockId },
    };
    const data = req.body;
    const stock = await Stock.findOne(options);

    stock.update({ ...data, stockId: req.params.stockId });

    res.status(201).json({
      message: "Stock updated",
      data: stock,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const deleteStock = async (req, res) => {
  try {
    const options = { where: { stockId: req.params.stockId } };
    const stock = await Stock.findOne(options);
    stock.destroy();
    res.status(200).json({ message: "Stock has been deleted" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export {
  searchStock,
  createStock,
  getOneStock,
  putStock,
  deleteStock,
};

