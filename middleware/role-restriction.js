function roleRestriction(roleId) {
    return function(req, res, next) {
        if (req.session && req.session.roleId && req.session.roleId <= roleId) {
            return next();
        } else {
            err.status = 401;
            return next(err);
        }
    }
}

module.exports = requiresLogin;