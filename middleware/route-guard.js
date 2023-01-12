const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/signup");
  }
}
module.exports = {isAuth};
