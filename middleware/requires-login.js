function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('Vous devez être connecté pour accéder à cette page');
        err.status = 401;
        return next(err);
    }
}
module.exports = requiresLogin;