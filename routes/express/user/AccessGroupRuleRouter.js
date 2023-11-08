import express from "express";
import expressAsyncHandler from "express-async-handler";
import {
  createAccessGroupRule,
  searchAccessGroupRule,
} from "../../../controllers/user/AccessGroupRuleController.js";
import authorizeAuth from "../../../middleware/authorizeAuth.js";
import checkAccessRule from "../../../middleware/checkAccessAccounts.js";

const router = express.Router();

router.post(
  "/:accessGroupId/access-rules",
  authorizeAuth,
  checkAccessRule("access-groups/write"),
  expressAsyncHandler(createAccessGroupRule)
);
router.post(
  "/access-rules/search",
  authorizeAuth,
  checkAccessRule("access-groups/read"),
  expressAsyncHandler(searchAccessGroupRule)
);

export default router;
