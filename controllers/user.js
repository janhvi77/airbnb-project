const User = require("../models/User.js");


module.exports.signup =
    async(req, res) => {
        try {
            const { username, email, password } = req.body;

            const newUser = new User({ username, email });

            // passport-local-mongoose method
            const registeredUser = await User.register(newUser, password);

            console.log(registeredUser);
            req.login(registeredUser, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash("success", "user register sucessfuly");
                res.redirect("/listings");
            });
        } catch (e) {

            req.flash("error", e.message);
            res.redirect("/signup");
        }
    };


module.exports.rendersignupform = (req, res) => {
    res.render("users/signup.ejs");
};



module.exports.renderlogin = (req, res) => {
    res.render("users/login.ejs");
};



module.exports.logout =
    (req, res) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "you are logged out");
            res.redirect("/listings");
            console.log(req.logout)
        })
    };



module.exports.login = async(req, res) => {
    req.flash("success", " welcome back to wandurlust ");
    res.redirect("/listings");
};