//app.js
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
};


const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const reviewsRoutes = require("./routes/reviews.js");
const usersRoutes = require("./routes/users.js");
const moviesRoutes = require("./routes/movies.js")
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const dbUrl = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test";
const mongoose = require("mongoose");


mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Mongo connection open");
  })
  .catch((err) => {
    console.log(err);
  });

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret
  }
});

store.on('error', function (e) {
  console.log("SESSION STORE ERROR", e)
});

const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(morgan('dev'));
app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy: false}));

app.use(session(sessionConfig));
app.use(flash());

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", ejsMate);

app.use("/reviews", reviewsRoutes);
app.use("/users", usersRoutes);
app.use("/", moviesRoutes);

app.get('/', (req, res) => {
  res.redirect('/home');
})

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Something went wrong";
  }
  res.status(statusCode).render("error", { err });
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});

