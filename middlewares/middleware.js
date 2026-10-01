exports.isLoggedIn = (req, res, next) => {
    if (typeof req.isAuthenticated !== 'function' || !req.isAuthenticated()) {
        //req.flash("error", "You must be logged in first!");
        return res.redirect("/app/login?message=Please%20log%20in%20first");
    }
    next();
};


