import { Op } from "sequelize";
import { HttpNotFoundError } from "../../lib/errors.js";
import AccessGroup from "../../models/user/AccessGroup.js";
import Account from "../../models/user/Account.js";
import User from "../../models/user/User.js";
import UserToAccountAccessGroup from "../../models/user/UserToAccountAccessGroup.js";

const createUserToAccountAccessGroup = async (req, res) => {
  const accountId = req.params.accountId;
  const accessGroupId = req.params.accessGroupId;

  const email = req.body.email;

  const account = await Account.findByPk(accountId);

  if (!account) throw new HttpNotFoundError("Account does not exist");

  const accessGroup = await AccessGroup.findByPk(accessGroupId);

  if (!accessGroup) throw HttpNotFoundError("Access group does not exist");

  const user = await User.findOne({ where: { email } });

  if (!user) throw new HttpNotFoundError("User does not exist");

  const userToAccountAccessGroup = await UserToAccountAccessGroup.create({
    accountId,
    accessGroupId,
    userId: user.userId,
  });

  res.status(201).json({
    userToAccountAccessGroup,
  });
};

const allUserToAccountAccessGroup = async (req, res) => {
  const { accountId, accessGroupId, userId } = req.query;

  const filters = [];

  if (accountId) {
    filters.push({
      accountId: {
        [Op.eq]: `${accountId}`,
      },
    });
  }

  if (accessGroupId) {
    filters.push({
      accessGroupId: {
        [Op.eq]: `${accessGroupId}`,
      },
    });
  }

  if (userId) {
    filters.push({
      userId: {
        [Op.eq]: `${userId}`,
      },
    });
  }

  const options = {
    where: {
      [Op.and]: filters,
    },

    order: [["accountId", "DESC"]],
    include: [
      {
        model: Account,
      },
      {
        model: AccessGroup,
      },
      {
        model: User,
      },
    ],
  };

  const userToAccountAccessGroupList = await UserToAccountAccessGroup.findAll(
    options
  );

  res.status(200).json({
    userToAccountAccessGroupList,
  });
};

const getUserToAccountAccessGroup = async (req, res) => {
  const userToAccountAccessGroupId = req.params.userToAccountAccessGroupId;

  const userToAccountAccessGroup = await UserToAccountAccessGroup.findOne({
    where: {
      userToAccountAccessGroupId,
    },
    include: [
      {
        model: Account,
      },
      {
        model: AccessGroup,
      },
      {
        model: User,
      },
    ],
  });

  if (!userToAccountAccessGroup) {
    throw new HttpNotFoundError("User to account access group does not exist");
  }

  res.status(200).json({
    userToAccountAccessGroup,
  });
};

export {
  createUserToAccountAccessGroup,
  getUserToAccountAccessGroup,
  allUserToAccountAccessGroup,
};
