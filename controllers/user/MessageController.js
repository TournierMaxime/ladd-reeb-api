import { Op } from "sequelize";
import { HttpNotFoundError } from "../../lib/errors.js";
import Account from "../../models/user/Account.js";
import Message from "../../models/user/Message.js";

const createMessage = async (req, res) => {
  const accountId = req.params.accountId;
  const { type, recipient, data } = req.body;

  const account = await Account.findOne({
    where: { accountId },
  });

  if (!account) {
    throw new HttpNotFoundError("Account does not exist");
  }

  const message = await Message.create({
    type,
    recipient,
    data,
    accountId,
  });

  // Cas de succès
  res.status(201).json({
    message,
  });
};

const getMessage = async (req, res) => {
  const messageId = req.params.messageId;

  const message = await Message.findOne({
    where: { messageId },
  });

  if (!message) {
    throw new HttpNotFoundError("Message does not exist");
  }

  res.status(200).json({
    message,
  });
};

const searchMessage = async (req, res) => {
  const accounts = req.accounts;
  const { messageId, accountId, data, status, type, recipient, sentAt } =
    req.query;
  // Pagination
  const pageAsNumber = Number(req.query.page);
  const sizeAsNumber = Number(req.query.size);
  let page = 1;
  let size = 50;

  if (!Number.isNaN(pageAsNumber) && pageAsNumber >= 0) {
    page = pageAsNumber;
  }

  if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber <= 500) {
    size = sizeAsNumber;
  }
  const filters = [];
  if (accounts) {
    filters.push({
      accountId: {
        [Op.in]: accounts.map((a) => a.accountId),
      },
    });
  }

  if (messageId) {
    filters.push({ messageId: { [Op.like]: `${messageId}%` } });
  }
  if (accountId) {
    filters.push({ accountId: { [Op.like]: `${accountId}%` } });
  }
  if (data) {
    filters.push({ data: { [Op.like]: `${data}%` } });
  }
  if (status) {
    filters.push({ status: { [Op.like]: `${status}%` } });
  }
  if (type) {
    filters.push({ type: { [Op.like]: `${type}%` } });
  }
  if (recipient) {
    filters.push({ recipient: { [Op.like]: `${recipient}%` } });
  }
  if (sentAt) {
    filters.push({ sentAt: { [Op.like]: `${sentAt}%` } });
  }

  const options = {
    where: {
      [Op.and]: filters,
    },
    limit: size,
    offset: (page - 1) * size,
    order: [["messageId", "DESC"]],
  };
  const count = await Message.count();
  const messageList = await Message.findAll(options);

  // Cas de succès
  res.status(201).json({
    messageList,
    items: messageList.length,
    results: count,
    currentPage: page,
    totalPages: Math.ceil(count / size),
  });
};

const updateMessage = async (req, res) => {
  const messageId = req.params.messageId;
  const data = req.body;

  const message = await Message.findOne({
    where: { messageId },
  });

  if (!message) {
    throw new HttpNotFoundError("Message does not exist");
  }

  message.update({ ...data, messageId });

  res.status(201).json({});
};

const deleteMessage = async (req, res) => {
  const messageId = req.params.messageId;
  const message = await Message.findOne({ where: { messageId } });

  if (!message) {
    throw new HttpNotFoundError("Message does not exist");
  }

  message.destroy();

  res.status(200).json({});
};

export {
  createMessage,
  getMessage,
  searchMessage,
  updateMessage,
  deleteMessage,
};
