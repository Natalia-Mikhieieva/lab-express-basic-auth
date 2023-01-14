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

router.post("/signup", (req, res, next) => {
  console.log(req.body);

  const { username, password } = req.body;

  //checking if all the required fields are filled in
  if (!email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "Please fill in all mandatory fields. Email and Password are required",
    });
    return;
  }

  //validate that the user password is at least 6 characters long and has 1 capital letter and 1 lowercase letter
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.render("auth/signup", {
      errorMessage:
        "Please input a password: at least 6 characters long, with a lowercase and uppercase letter",
    });
    return;
  }

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
      //Check if any of our mongoose validators are not being met
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      }
      //Check if the email is already registered with our website
      else if (error.code === 11000) {
        res.render("auth/signup", {
          errorMessage:
            "There is already an account associated with this emaail please sign in or sign up with new email",
        });
      } else {
        next(error);
      }
    }); // close .catch()
}); // close .post()

router.get("/login", isLoggedOut, (req, res) => {
  console.log(req.sesion);
  res.render("auth/login");
});
//custom middleware functions
router.get("/profile", isLoggedIn, (req, res) => {
  res.render("user/user-profile", { userInfo: req.session.currentUser });
});

router.post("/login", (req, res) => {
  console.log("SESSION =====>", req.session);
  console.log(req.body);
  const { email, password } = req.body;

  //first we are checking if the user filled in all the required fields
  if (!email || !password) {
    res.render("auth/login", {
      errorMessage: "please enter an email or password",
    });
    return;
  }
  //second we are checking if the email is already registered with our website
  User.findOne({ email })
    .then((user) => {
      console.log(user);
      if (!user) {
        res.render("auth/login", {
          errorMessage:
            "User not found please sign up. No account associated with email",
        });
      }
      //compareSync() is used to compare the user inputted password with the hashed password in the database
      else if (bcrypt.compareSync(password, user.passwordHash)) {
        //i can use req.session.currentUser in all my other routes
        req.session.currentUser = user;
        res.redirect("/profile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect Password" });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/main", (req, res) => {
  res.render("user/main", { userInSession: req.session.currentUser });
});
router.get("/private", (req, res) => {
  res.render("user/private", { userInSession: req.session.currentUser });
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/login");
  });
});

module.exports = router;
