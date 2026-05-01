const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/User.js");
const wrapAsync = require("../utils/wrapAsync.js");





const usercontroller = require("../controllers/user.js");

router.get("/login", usercontroller.renderlogin);

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }), usercontroller.login);





router.get("/signup", usercontroller.rendersignupform);


router.post("/signup", wrapAsync(usercontroller.signup));




router.get("/logout", usercontroller.logout);




module.exports = router;