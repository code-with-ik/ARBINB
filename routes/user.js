const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware");
const userController = require("../controllers/user");

router
  .route("/signup")
  .get(userController.renderFormSignup)
  .post(userController.signup);

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveredirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);

module.exports = router;
