const User = require("../models/user");

module.exports.renderFormSignup = (req, res) => {
    res.render("./user/signup");
  }

  module.exports.signup = async (req, res, next) => {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registerUser = await User.register(newUser, password);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "welcome to wonderlust");
      res.redirect("/listings");
    });
  }

  module.exports.renderLoginForm = (req, res) => {
    res.render("./user/login");
  }

  module.exports.login =  async (req, res) => {
    req.flash("success", "Hi, welcome back to wonderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

  module.exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        next(err);
      }
      req.flash("success", "you logged out!");
      res.redirect("/listings");
    });
  }