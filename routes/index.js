const express = require("express");
const router = express.Router();

// added : 
// const sneakerModel = require("./../model/Sneaker");
// const tagModel = require("./../model/Tag");
// const userModel = require("./../model/User");




router.get("/", (req, res) => {
  res.render("index.hbs");
});

router.get("/sneakers/:id", (req, res) => {
  res.render("partial/sneaker_mini.hbs");
});

router.get("/one-product/:id", (req, res) => {
  res.send("baz");
});

router.get("/signup", (req, res) => {
  res.send("sneak");
});

router.get("/signin", (req, res) => {
  res.send("love");
});


module.exports = router;
