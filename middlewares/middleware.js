exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        req.flash("error", "You must be logged in first!");
        return res.redirect("/app/login");
    }
    next();
};
