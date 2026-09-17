const User = require("../models/user.js");



module.exports.renderSignupForm = (req,res)=>{
    res.render("User/signup.ejs");
}


module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send("Please fill all fields");
        }

        const newUser = new User({
            username,
            email
        });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            return res.redirect("/app");
        });

    } catch (e) {
        console.error("Signup error:", e);
        return res.status(400).send(e.message);
    }
};




module.exports.renderLoginForm = (req,res)=>{
    res.render("User/login.ejs")
};


module.exports.login = async (req,res)=>{
    let {username, password} = req.body;
    if(!username || !password){
        req.flash("error","Please provide correct username and password");
        return res.redirect("/app/login")
    }
    try{
        const user = await User.findOne({username});
        if(!user){
            req.flash("error","Invalid username or password");
            return res.redirect("/app/login");
        }
        req.flash("success","Welcome to Eshop, Successfully logged-in");
        return res.redirect("/app");
    }
    catch(e){
        console.error("Login error:", e);
        req.flash("error", "Something went wrong, please try again");
        res.redirect("/app/login");
    }  
}


module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you logged out!");
        res.redirect("/app");
    })
};
