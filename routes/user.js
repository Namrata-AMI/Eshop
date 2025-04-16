const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

const passport = require("passport");

const userController = require("../controllers/user.js");


router.route("/signup")
.get(userController.renderSignupForm)
.post(userController.signup);



router.route("/login")
.get(userController.renderLoginForm)
.post(passport.authenticate("local",
    {failureRedirect:"/app/login",               //used middleware "passport.authenticate()"//
    failureFlash: true}),(req,res)=>{
        req.flash("success","Welcome to Eshop, You are logged in !");
        res.redirect("/app");
    });





router.get("/logout",userController.logOut);


module.exports = router;
