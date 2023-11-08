import { Op } from "sequelize";
import Order from "../models/Order.js";
import User from "../models/user/User.js";

const searchOrder = async (req, res) => {
  try {
    const { orderId, userId } = req.query;
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

    if (orderId) {
      filters.push({
        orderId: {
          [Op.like]: `${orderId}%`,
        },
      });
    }

    if (userId) {
      filters.push({
        userId: {
          [Op.like]: `${userId}%`,
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
      order: [["orderId", "DESC"]],
      include: [{ model: User }],
    };
    const count = await Order.count(options);
    const orders = await Order.findAll(options);

    //Cas de succès
    res.status(200).json({
      orders,
      items: orders.length,
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

const createOrder = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findOne({});
    const order = await Order.create({
      ...data,
      userId: user.dataValues.userId,
    });
    //Cas de succès
    res.status(201).json({
      message: "Order created",
      data: order,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const getOneOrder = async (req, res) => {
  try {
    const options = {
      where: { orderId: req.params.orderId },
    };
    const order = await Order.findOne(options);
    res.status(200).json({
      data: order,
    });
  } catch (error) {
    res.status(404).json({ error });
  }
};

const putOrder = async (req, res) => {
  try {
    const options = {
      where: { orderId: req.params.orderId },
    };
    const data = req.body;
    const order = await Order.findOne(options);

    order.update({ ...data, orderId: req.params.orderId });

    res.status(201).json({
      message: "Order updated",
      data: order,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const options = { where: { orderId: req.params.orderId } };
    const order = await Order.findOne(options);
    order.destroy();
    res.status(200).json({ message: "Order has been deleted" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export { searchOrder, createOrder, getOneOrder, putOrder, deleteOrder };
