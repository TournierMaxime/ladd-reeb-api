import express from "express";
import expressAsyncHandler from "express-async-handler";

import {
  createMessage,
  deleteMessage,
  getMessage,
  searchMessage,
  updateMessage,
} from "../../../controllers/user/MessageController.js";
import authorizeAuth from "../../../middleware/authorizeAuth.js";
import checkAccessRule from "../../../middleware/checkAccessAccounts.js";
const router = express.Router();

router.post(
  "/",
  authorizeAuth,
  checkAccessRule("messages/write"),
  expressAsyncHandler(createMessage)
);

router.post(
  "/search",
  authorizeAuth,
  checkAccessRule("messages/read"),
  expressAsyncHandler(searchMessage)
);

router.get(
  "/:messageId",
  authorizeAuth,
  checkAccessRule("messages/read"),
  expressAsyncHandler(getMessage)
);

router.put(
  "/:messageId",
  authorizeAuth,
  checkAccessRule("messages/write"),
  expressAsyncHandler(updateMessage)
);

router.delete(
  "/:messageId",
  authorizeAuth,
  checkAccessRule("messages/write"),
  expressAsyncHandler(deleteMessage)
);

export default router;
