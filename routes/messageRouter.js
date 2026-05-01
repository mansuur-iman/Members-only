const { Router } = require("express");
const messageRouter = Router();
const messageController = require("../controllers/messageController");
const { isAdmin, isLoggedIn } = require("../middlewear/auth");

messageRouter.get("/", messageController.showAllMessages);
messageRouter.get(
  "/message/new",
  isLoggedIn,
  messageController.showMessageForm,
);
messageRouter.post(
  "/message/new",
  isLoggedIn,
  messageController.saveNewMessage,
);
messageRouter.get(
  "/message/:id/edit",
  isLoggedIn,
  messageController.showEditForm,
);
messageRouter.post(
  "/message/:id/update",
  isLoggedIn,
  messageController.updatePost,
);
messageRouter.post(
  "/message/:id/delete",
  isLoggedIn,
  isAdmin,
  messageController.deleteMessage,
);

module.exports = messageRouter;
