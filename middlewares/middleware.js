exports.isLoggedIn = (req, res, next) => {
    if (typeof req.isAuthenticated !== 'function' || !req.isAuthenticated()) {
        req.flash("error", "You must be logged in first!");
        return res.redirect("/app/login");
    }
    next();
};
