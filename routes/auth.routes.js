const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");
const { isAuth } = require("../middleware/route-guard");

// GET route ==> to display the signup form to users
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

//ITERATION 3
router.get("/main", isAuth, (req, res, next) => {
  res.render("main");
});

router.get("/private", isAuth, (req, res, next) => {
  res.render("private");
});
// POST route ==> to process form data

router.post("/signup", (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => {
      console.log("salt:", salt);
      //hash is the method that hashes our password, takes 2 arguments: 1) password, 2) salt
      return bcryptjs.hash(password, salt);
    })
    .then((hashedPassword) => {
      console.log("hashed Password:", hashedPassword);
      User.create({
        username: username,
        passwordHash: hashedPassword,
      });
      res.redirect("/profile");
    })
    .catch((error) => {
      console.log(error);
    });
});

// GET route ==> to display users profile
router.get("/profile", (req, res) => {
  res.render("users/user-profile");
});

module.exports = router;
