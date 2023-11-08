import { Op } from "sequelize";
import { HttpNotFoundError } from "../../lib/errors.js";
import AccessGroup from "../../models/user/AccessGroup.js";
import AccessGroupRule from "../../models/user/AccessGroupRule.js";

const createAccessGroupRule = async (req, res) => {
  const accessGroupId = req.params.accessGroupId;
  const data = req.body;

  const accessGroup = await AccessGroup.findOne({
    where: { accessGroupId },
  });

  if (!accessGroup) {
    throw new HttpNotFoundError("Access group not found");
  }

  const accessGroupRule = await AccessGroupRule.create({
    ...data,
    accessGroupId,
  });

  // Cas de succès
  res.status(201).json({
    accessGroupRule,
  });
};

const searchAccessGroupRule = async (req, res) => {
  const { accessGroupRuleId, accessGroupId, rule, name } = req.query;
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

  if (accessGroupRuleId) {
    filters.push({
      accessGroupRuleId: {
        [Op.like]: `${accessGroupRuleId}%`,
      },
    });
  }
  if (accessGroupId) {
    filters.push({
      accessGroupId: {
        [Op.like]: `${accessGroupId}%`,
      },
    });
  }

  if (rule) {
    filters.push({
      rule: {
        [Op.like]: `${rule}%`,
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
  const options = {
    where: {
      [Op.and]: filters,
    },
    limit: size,
    offset: (page - 1) * size,
    order: [["accessGroupRuleId", "DESC"]],
    include: {
      model: AccessGroup,
    },
  };
  const count = await AccessGroupRule.count();
  const accessGroupRuleList = await AccessGroupRule.findAll(options);

  res.status(200).json({
    accessGroupRuleList,
    items: accessGroupRuleList.length,
    results: count,
    currentPage: page,
    totalPages: Math.ceil(count / size),
  });
};

export { createAccessGroupRule, searchAccessGroupRule };
