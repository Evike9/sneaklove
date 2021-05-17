const express = require("express");
const router = express.Router();
const UserModel = require("./../models/User");
const bcrypt = require("bcrypt");
const SneakerModel = require("../models/Sneaker");
const TagModel = require("./../models/Tag");

// Basic redirection ///////////////////////////////////////////////////

router.get("/", (req, res) => {
  res.render("index.hbs");
});

router.get("/home", (req, res) => {
  res.render("index.hbs");
});


router.get("/sneakers/collection", (req, res) => {
  SneakerModel.find()
  .then((list)=>{
    res.render("products.hbs");
  })
  .catch(next)
});

router.get("/one-product/:id", (req, res) => {
  res.send("baz");
});

// Auth //////////////////////////////////////////////////////////////
router.get("/signup", (req, res) => {
res.render("signup");
});

router.get("/signin", (req, res) => {
  res.render("signin");
});


router.post("/signin", async (req, res, next) => {

  const { email, password } = req.body;
  const foundUser = await UserModel.findOne({ email: email });
  if (!foundUser) {
    req.flash("error", "Invalid credentials");
    res.redirect("/signin");
  } else {
    const isSamePassword = bcrypt.compareSync(password, foundUser.password);
    if (!isSamePassword) {
      req.flash("error", "Invalid credentials");
      res.redirect("/signin");
    } else {
      const userObject = foundUser.toObject();
      delete userObject.password; // remove password before saving user in session
      // console.log(req.session, "before defining current user");
      req.session.currentUser = userObject; // Stores the user in the session (data server side + a cookie is sent client side)
      req.flash("success", "Successfully logged in...");
      res.redirect("/home");
    }
  }
});

router.post("/signup",  async (req, res, next) => {
    
  try {
    const newUser = { ...req.body }; // clone req.body with spread operator
    const foundUser = await UserModel.findOne({email: newUser.email });

    if (foundUser) {
      req.flash("warning", "Email already registered");
      res.redirect("/signup");
    } else {

      const hashedPassword = bcrypt.hashSync(newUser.password, 10);
      newUser.password = hashedPassword;
      if (!req.file) UserModel.avatar = undefined;
      else UserModel.avatar = req.file.path;
      await UserModel.create(newUser);
      req.flash("success", "Congrats ! You are now registered !");
      res.redirect("/signin");
    }
  } catch (err) {
    let errorMessage = "";
    for (field in err.errors) {
      errorMessage += err.errors[field].message + "\n";
    }
    req.flash("error", errorMessage);
    res.redirect("/signup");
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

/// Create sneaker //////////////////////////////////////////////////


router.get("/prod-add", async (req, res, next) => {
  SneakerModel.find()
    .then(() => {
      res.render("products_add.hbs");
    })
    .catch(next);
});


router.post("/prod-add",  async (req, res, next) => {
  const newSneaker = { ...req.body };
  try {
    await SneakerModel.create(newSneaker);
    res.redirect("products");
  } catch (err) {
    res.redirect("/");
  }
});

/// Create tags ///////////////////////////////////////////////////////////


router.post("/tag-add",  async (req, res, next) => {
  const newTag = { ...req.body };
  try {
    await TagModel.create(newTag);
    res.redirect("index");
  } catch (err) {
    next(err);
  }
});






module.exports = router;
