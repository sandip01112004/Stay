if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
    console.log("Database URL:", process.env.ATLAS_URL); // Add this to debug
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = process.env.ATLAS_URL;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./util/wrapAsync.js");
const ExpressError = require("./util/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user.js");
const LocalStrategy = require("passport-local");

const listings = require("./routes/listingRoute.js");
const reviews = require("./routes/reviewRoute.js");
const users = require("./routes/userRoute.js");

async function main() {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
        });
        console.log("Connected to DB");
    } catch (err) {
        console.error("Failed to connect to DB", err);
    }
}

main();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "MySecret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: db,
        touchAfter: 24 * 3600, // seconds
        crypto: {
            secret: process.env.SECRET,
        },
    }),
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Corrected the calculation for expires
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

sessionOptions.store.on("error", function (e) {
    console.log("Session Store Error", e);
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to set res.locals
app.use((req, res, next) => {
   // console.log('Current User:', req.user); // Debugging line
    res.locals.curruser = req.user || null;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong!";
    res.status(statusCode).render("error", { err,message:err.message });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("Shri Ganesha !");
    console.log(`Serving on port ${port}`);
});