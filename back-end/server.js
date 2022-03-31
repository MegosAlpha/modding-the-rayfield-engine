const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// setup middleware for parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mtre", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// additional middleware for parsing, cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require("cookie-session");
app.use(cookieSession({
  name: "session",
  keys: [
    "totallySecretValueThatAssuredlyGetsDeployedToProduction"
  ],
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// actual API routes
const users = require("./users.js");
app.use("/api/users", users.routes);

const photos = require("./games.js");
app.use("/api/games", photos.routes);

const comments = require("./comments.js");
app.use("/api/comments", comments.routes);

// route to serve games to users
app.use(express.static('public'))

// lift-off
app.listen(3002, () => console.log('MTRE API deployed on port 3002!'));

