const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect("/login");
  }
  next();
};
const isloggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect("/");
  }
  next();
};

module.exports = { isLoggedIn, isloggedOut };
