const { Router } = require("express");
const usersRouter = Router();
const userController = require("../controllers/userController");

const { isLoggedIn } = require("../middlewear/auth");

usersRouter.get("/sign-up", userController.showSignupForm);
usersRouter.post("/sign-up", userController.saveSignup);
usersRouter.get("/login", userController.showLoginForm);
usersRouter.post("/login", userController.saveLogin);
usersRouter.get("/join", isLoggedIn, userController.showMembershipForm);
usersRouter.post("/join", isLoggedIn, userController.saveMembership);
usersRouter.post("/logout", isLoggedIn, userController.logoutUser);

module.exports = usersRouter;
