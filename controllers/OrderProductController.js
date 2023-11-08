import { Op } from "sequelize";
import OrderProduct from "../models/OrderProduct.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const searchOrderProduct = async (req, res) => {
  try {
    const { orderProductId, orderId, productId } = req.query;
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

    if (orderProductId) {
      filters.push({
        orderProductId: {
          [Op.like]: `${orderProductId}%`,
        },
      });
    }

    if (orderId) {
      filters.push({
        orderId: {
          [Op.like]: `${orderId}%`,
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
      orderProduct: [["orderProductId", "DESC"]],
      include: [{ model: Order }],
      include: [{ model: Product }],
    };
    const count = await OrderProduct.count(options);
    const orderProducts = await OrderProduct.findAll(options);

    //Cas de succès
    res.status(200).json({
      orderProducts,
      items: orderProducts.length,
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

const createOrderProduct = async (req, res) => {
  try {
    const data = req.body;
    const orderProduct = await OrderProduct.create({
      ...data,
    });
    //Cas de succès
    res.status(201).json({
      message: "OrderProduct created",
      data: orderProduct,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const getOneOrderProduct = async (req, res) => {
  try {
    const options = {
      where: { orderProductId: req.params.orderProductId },
    };
    const orderProduct = await OrderProduct.findOne(options);
    res.status(200).json({
      data: orderProduct,
    });
  } catch (error) {
    res.status(404).json({ error });
  }
};

const putOrderProduct = async (req, res) => {
  try {
    const options = {
      where: { orderProductId: req.params.orderProductId },
    };
    const data = req.body;
    const orderProduct = await OrderProduct.findOne(options);

    orderProduct.update({ ...data, orderProductId: req.params.orderProductId });

    res.status(201).json({
      message: "OrderProduct updated",
      data: orderProduct,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const deleteOrderProduct = async (req, res) => {
  try {
    const options = { where: { orderProductId: req.params.orderProductId } };
    const orderProduct = await OrderProduct.findOne(options);
    orderProduct.destroy();
    res.status(200).json({ message: "OrderProduct has been deleted" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export {
  searchOrderProduct,
  createOrderProduct,
  getOneOrderProduct,
  putOrderProduct,
  deleteOrderProduct,
};

