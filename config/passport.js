const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../db/queries");

const callback = async (username, password, done) => {
  try {
    const user = await db.findUserByUsername(username);

    if (!user) {
      return done(null, false, { message: "Invalid credentials" });
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return done(null, false, { message: "Wrong password" });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

passport.use(new LocalStrategy(callback));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.findUserById(id);

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
});
