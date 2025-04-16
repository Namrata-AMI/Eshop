require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const User = require("./models/user.js");
const cors = require("cors");

const productRoutes = require("./routes/product.js");
const userRoutes = require("./routes/user.js");


const dbUrl = process.env.MONGO_URL;

const allowedOrigins = [
    'http://localhost:8080',
    'https://eshop-2-9ery.onrender.com/app'
];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));



app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));




const sessionOptions = {
    secret: process.env.SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


app.use(session(sessionOptions));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.newUser = req.user;
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
});




app.use("/app", userRoutes);
app.use("/app", productRoutes);

app.all("*", (req, res) => {
    req.flash("error", "Page not available");
    return res.redirect("/app");
});


async function main() {
    await mongoose.connect(dbUrl);
}
main()
    .then(() => {
        console.log("mongoDB connected");
    })
    .catch((e) => {
        console.error("mongoDB connection error:", e);
    });


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
