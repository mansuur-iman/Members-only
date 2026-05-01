const db = require("../db/queries.js");
const { body, validationResult, matchedData } = require("express-validator");

const validatePost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("title is required.")
    .isLength({ min: 10, max: 50 })
    .withMessage("title should be between 10 and 50 characters long."),
  body("text").trim().notEmpty().withMessage("text is required."),
];

const showAllMessages = async (req, res) => {
  try {
    const messages = await db.getAllMessages();
    const filteredMessages = messages.map((message) => ({
      ...message,
      username: req.user?.membership_status ? message.username : null,
      created_at: req.user?.membership_status ? message.created_at : null,
    }));
    return res.render("index", {
      title: "All messages",
      filteredMessages,
    });
  } catch (err) {
    console.error(err);
  }
};

const showMessageForm = (req, res) => {
  try {
    return res.render("messages", {
      title: "Share your thoughts",
      message: null,
      errors: [],
      action: "/message/new",
    });
  } catch (err) {
    console.error(err);
  }
};

const saveNewMessage = [
  ...validatePost,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.render("messages", {
          title: "Error",
          message: null,
          errors: errors.array(),
          action: "/message/new",
        });
      }

      const data = matchedData(req);
      await db.createMessage(data.title, data.text, req.user.id);
      return res.redirect("/");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  },
];

const showEditForm = async (req, res) => {
  const { id } = req.params;
  const message = await db.getMessageById(id);

  if (!message) {
    return res.status(404).send("post not found.");
  }

  if (req.user.id !== message.user_id) {
    return res.status(403).send("Not authorized.");
  }

  return res.render("messages", {
    title: "Edit post",
    message,
    errors: [],
    action: `/message/${id}/update`,
  });
};

const updatePost = [
  ...validatePost,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.render("messages", {
          title: "Error",
          message: null,
          errors: errors.array(),
          action: `/message/${id}/update`,
        });
      }
      const message = await db.getMessageById(id);

      if (!message) {
        return res.status(404).send("post not found.");
      }

      if (req.user.id !== message.user_id) {
        return res.status(403).send("not authorized.");
      }

      const data = matchedData(req);
      await db.updateMessage(id, data.title, data.text);

      return res.redirect("/");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  },
];

const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await db.getMessageById(id);
    if (!message) {
      return res.status(404).send("post not found.");
    }
    if (req.user.id !== message.user_id) {
      return res.status(403).send("Not authorized.");
    }
    await db.deletePost(id);
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  showAllMessages,
  saveNewMessage,
  showMessageForm,
  showEditForm,
  updatePost,
  deleteMessage,
};
