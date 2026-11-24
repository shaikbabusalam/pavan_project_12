const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user");
const { saveRedirectUrl } = require("../middlewares");

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (err) {
    let msg = err.message;
    if (err.code === 11000 || err.name === "UserExistsError") {
      if (err.keyPattern && err.keyPattern.email) {
        msg = "That email is already registered. Please log in instead.";
      } else {
        msg = "That username is already taken. Please choose another or log in.";
      }
    }
    req.flash("error", msg);
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out!");
    res.redirect("/listings");
  });
});

module.exports = router;