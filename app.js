//line for envfile
if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

console.log(process.env.SECRET);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expresserror.js");
const session = require("express-session");
const flash = require("connect-flash")
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("./models/User.js")
    // Models & Utils






const listingsrout = require("./routes/listing.js");
const reviewsrout = require("./routes/review.js");
const userrout = require("./routes/user.js");
//const console = require('console');
//onst User = require("./models/user.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/test";


// DB Connection
main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch(err => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}


const wrapAsync = (fn) => {
        return function(req, res, next) {
            fn(req, res, next).catch(next);
        }
    }
    // View Engine Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//app.use("/listings", listingsroutes);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// --- Dummy Validation Middleware ---
// In a real app, you'd use Joi here. This prevents the "validateReview is not defined" error.
const validateReview = (req, res, next) => {
    if (!req.body.review) {
        throw new ExpressError(400, "Review data is required");
    }
    next();
};

const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,

        max: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//app.get("/demouser", async(req, res) => {
// try {
//     let fakeUser = new User({
//         email: "janhvi@gmail.com",
//    username: "januuu1234"
//  });

// let registeredUser = await User.register(fakeUser, "helloworld");

//  res.send(registeredUser);
//} catch (err) {
//    res.send(err);
//  }
//});

// --- Routes ---

// Root Route
app.get("/", (req, res) => {
    res.send("hi i am root");
});

app.use("/listings", listingsrout);
app.use("/listings/:id/reviews", reviewsrout);
app.use("/", userrout);


// --- Error Handling ---

// 404 Handler
app.all(/("*")/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Final Error Handler
app.use((err, req, res, next) => {
    console.log(err); // VERY IMPORTANT
    res.send(err.message);
});

// Server
app.listen(8080, () => {
    console.log("server is running on port 8080");
});