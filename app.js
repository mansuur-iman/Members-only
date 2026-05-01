require("dotenv").config();
require("./config/passport");

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("node:path");
const pgSession = require("connect-pg-simple")(session);

const usersRouter = require("./routes/usersRouter");
const messageRouter = require("./routes/messageRouter");
const pool = require("./db/pool");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

const sessionStore = new pgSession({
  pool: pool,
  tableName: "session",
  createTableIfMissing: true,
});

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", messageRouter);
app.use("/", usersRouter);

app.listen(PORT, () => {
  console.log(`Running server on port: ${PORT}`);
});
