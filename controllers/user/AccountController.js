import { Op } from "sequelize";
import { HttpBadRequestError, HttpNotFoundError } from "../../lib/errors.js";
import AccessGroup from "../../models/user/AccessGroup.js";
import Account from "../../models/user/Account.js";
import User from "../../models/user/User.js";
import UserToAccountAccessGroup from "../../models/user/UserToAccountAccessGroup.js";

const createAccount = async (req, res) => {
  const data = req.body;
  const account = await Account.create({ data: {}, ...data });

  res.status(201).json({
    account,
  });
};

const searchAccount = async (req, res) => {
  const accounts = req.accounts;

  const { accountId, name, status } = req.query;
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
  // filtre sur les comptes auquel on access
  if (accounts) {
    filters.push({
      accountId: { [Op.in]: accounts.map((a) => a.accountId) },
    });
  }
  if (accountId) {
    filters.push({
      accountId: {
        [Op.eq]: `${accountId}`,
      },
    });
  }

  if (name) {
    filters.push({
      name: {
        [Op.like]: `${name}%`,
      },
    });
  }
  if (status) {
    filters.push({
      status: {
        [Op.like]: `${status}%`,
      },
    });
  }
  // Datas
  const options = {
    where: {
      [Op.and]: filters,
    },
    limit: size,
    offset: (page - 1) * size,
    order: [["accountId", "DESC"]],
  };
  const count = await Account.count();
  const accountList = await Account.findAll(options);

  // Cas de succès
  res.status(201).json({
    accountList,
    items: accountList.length,
    results: count,
    currentPage: page,
    totalPages: Math.ceil(count / size),
  });
};

const getAccount = async (req, res) => {
  const accountId = req.params.accountId;

  const account = await Account.findOne({
    where: { accountId },
  });

  res.status(200).json({
    account,
  });
};

const updateAccount = async (req, res) => {
  const accountId = req.params.accountId;
  const data = req.body;

  const account = await Account.findOne({
    where: { accountId },
  });

  if (!account) {
    throw new HttpNotFoundError("Account not found");
  }

  account.update({ ...data, accountId });

  res.status(200).json({
    account,
  });
};

const deleteAccount = async (req, res) => {
  const accountId = req.params.accountId;

  const account = await Account.findOne({ where: { accountId } });

  if (!account) {
    throw new HttpNotFoundError("Account not found");
  }

  account.destroy();

  res.status(200).json({});
};

const deleteAccountUser = async (req, res) => {
  const accountId = req.params.accountId;
  const userId = req.params.userId;

  const account = await Account.findByPk(accountId);

  if (!account) {
    throw new HttpNotFoundError("Account not found");
  }

  const user = await User.findByPk(userId);

  if (!user) {
    throw new HttpNotFoundError("User not found");
  }

  const deleteUserToAccount = await UserToAccountAccessGroup.findOne({
    where: { accountId, userId },
  });

  if (!deleteUserToAccount) {
    throw new HttpBadRequestError("User is not associated to account");
  }

  await deleteUserToAccount.destroy();

  return res.status(200).json({});
};

const updateAccountUser = async (req, res) => {
  const accountId = req.params.accountId;
  const userId = req.params.userId;
  const accessGroupId = req.body.accessGroupId;

  const account = await Account.findByPk(accountId);

  if (!account) {
    throw new HttpNotFoundError("Account not found");
  }

  const user = await User.findByPk(userId);

  if (!user) {
    throw new HttpNotFoundError("User not found");
  }

  const accessGroup = await AccessGroup.findByPk(accessGroupId);

  if (!accessGroup) {
    throw new HttpNotFoundError("Access group not found");
  }

  const updateUserToAccount = await UserToAccountAccessGroup.findOne({
    where: {
      accountId,
      userId,
    },
  });

  if (!updateUserToAccount) {
    throw new HttpBadRequestError("User is not associated to account");
  }

  updateUserToAccount.accessGroupId = accessGroupId;
  await updateUserToAccount.save();

  return res.status(200).json({});
};

export {
  createAccount,
  searchAccount,
  getAccount,
  updateAccount,
  deleteAccount,
  deleteAccountUser,
  updateAccountUser,
};
