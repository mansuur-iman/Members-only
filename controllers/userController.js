const db = require("../db/queries.js");
const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const alphaErr = "Must be only letters";
const characterErr = "Must be between 8 and 20 characters.";

const validateSignup = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("firstname is required.")
    .isAlpha()
    .withMessage(`firstname ${alphaErr}`),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("lastname is required.")
    .isAlpha()
    .withMessage(`lastname ${alphaErr}`),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required.")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required.")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required.")
    .isLength({ min: 8, max: 20 })
    .withMessage(`password ${characterErr}`),
  body("confirm_password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

const secret = process.env.SECRET_PASSCODE;

const validateLogin = [
  body("username").trim().notEmpty().withMessage("username is required."),
  body("password").trim().notEmpty().withMessage("password is required."),
];

const showSignupForm = (req, res) => {
  try {
    res.render("sign-up", {
      title: "Welcome to our sign up page",
      errors: [],
    });
  } catch (err) {
    console.error(err);
  }
};

const saveSignup = [
  ...validateSignup,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(errors.array());
      return res.render("sign-up", {
        title: "Errors",
        errors: errors.array(),
      });
    }
    const data = matchedData(req);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await db.createUser(
      data.first_name,
      data.last_name,
      data.username,
      data.email,
      hashedPassword,
      false,
      false,
    );
    return res.redirect("/login");
  },
];

const showLoginForm = (req, res) => {
  try {
    res.render("login", {
      title: "Welcome back",
      errors: [],
    });
  } catch (err) {
    console.error(err);
  }
};

const saveLogin = [
  ...validateLogin,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("login", {
        title: "Errors",
        errors: errors.array(),
      });
    }

    // Use Passport with custom callback
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.render("login", {
          title: "Login failed",
          errors: [{ msg: info.message }],
        });
      }
      // Login user and create session
      req.login(user, (err) => {
        if (err) return next(err);
        return res.redirect("/");
      });
    })(req, res, next); // <-- Here we immediately call the returned function
  },
];

const showMembershipForm = (req, res) => {
  try {
    res.render("join", {
      title: "Join The Club",
      errors: [],
      user: req.user,
    });
  } catch (err) {
    console.error(err);
  }
};

const saveMembership = async (req, res) => {
  try {
    const { passcode } = req.body;

    if (passcode !== secret) {
      return res.render("join", {
        title: "failed to join",
        errors: [{ msg: "incorrect passcode." }],
      });
    }

    await db.updateMembershipStatus(req.user.id, true);

    req.user.membership_status = true;
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
};

const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err); // handle logout errors
    // destroy session completely
    req.session.destroy((err) => {
      if (err) console.error("Failed to destroy session:", err);
      res.clearCookie("connect.sid"); // optional, clears session cookie
      res.redirect("/login"); // send user to login page
    });
  });
};

module.exports = {
  showSignupForm,
  saveSignup,
  showLoginForm,
  saveLogin,
  showMembershipForm,
  saveMembership,
  logoutUser,
};
