const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
};

const isMember = (req, res, next) => {
  if (req.user && req.user.membership_status === true) {
    return next();
  }

  return res.status(403).send("You must be a member to access this page.");
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.admin_status === true) {
    return next();
  }

  return res
    .status(403)
    .send("You must be admin to have access to this feature.");
};

module.exports = {
  isAdmin,
  isLoggedIn,
  isMember,
};
