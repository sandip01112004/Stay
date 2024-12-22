const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const wrapAsync = require("../util/wrapAsync");
const passport = require("passport");
const userController = require("../controllers/users.js");
const user = require("../models/user.js");

router.route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.signup));


router.route("/login")
    .get(userController.renderLogin)
    .post(passport.authenticate("local",{failureRedirect:"/login",failureFlash:"Enter valid username or password"}),userController.login);


router.get("/logout", userController.logout);
module.exports=router;