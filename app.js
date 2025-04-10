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
const methodOverride = require("method-override")
const User = require("./models/user.js");
const Products = require("./models/product.js");

const productRoutes = require("./routes/product.js");
const userRoutes = require("./routes/user.js");


const dbUrl = process.env.MONGO_URL;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));


const sessionOptions = {
    secret: process.env.SECRET,         // oour secret
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.newUser = req.user;
    console.log(res.locals.newUser);
    if(!req.session.cart){
        req.session.cart = [];
    }
    next();
})



app.use("/app",userRoutes)
app.use("/app",productRoutes);



app.all("*",(req,res,next)=>{
    req.flash("error","page not available");
    return res.redirect("/app");
})

main()
.then((res)=>{
    console.log(res);
    console.log("working db");
})
.catch((e)=>{
    console.log(e);
    console.log("db error");
})

async function main() {
    await mongoose.connect(dbUrl);
}

app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
})