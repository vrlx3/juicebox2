function requireUser (req, res, next) {
    if (!req.user) {
        next({
            name: "MissingUserError",
            message: "Please login in to continue"
        })
    }
    console.log(!req.user)
    next();

}

module.exports = {requireUser}