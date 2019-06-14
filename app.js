const path = require("path");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require("./models/user");
const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const MongoDbStore = require("connect-mongodb-session")(session);

const app = express();
const store = new MongoDbStore({
  uri: "mongodb://localhost:27017/onlineshop",
  collection: "sessions"
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "My Secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    console.log("SESSION USER NOT FOUND");
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      console.log("REQ USER:" + user._id);
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect("mongodb://localhost:27017/onlineshop", {
    useNewUrlParser: true
  })
  .then(() => {
    return User.findOne();
  })
  .then(user => {
    if (!user) {
      const user = new User({
        username: "simo",
        email: "simo@email.com",
        cart: { items: [] }
      });
      return user.save();
    }
  })
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
