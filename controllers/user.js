const User = require("../models/user.js");



module.exports.renderSignupForm = (req,res)=>{
    res.render("User/signup.ejs");
}


module.exports.signup = async(req,res)=>{
    try{
     let {username, email, password} = req.body;
     const newUser = new User ({username,email});
     const registeredUser = await User.register(newUser,password);
     console.log(registeredUser);
     req.login(registeredUser,(err)=>{          // using passport login method to make user already login after sign-in//
         if(err){
             return next(err);
        }
        req.flash("success","Welcome to Eshop!!");
        res.redirect("/app");
     });
    }
    catch(e){
     req.flash("error",e.message);
     res.redirect("/app/signup");
    }
 }




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
        console.error("Login error:", error);
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
