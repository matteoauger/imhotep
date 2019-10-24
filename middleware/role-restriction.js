function roleRestriction(role) {
    return function(req, res, next) {
        if (req.session && req.session.roleId <= role.id) {
            return next();
        } else {
            const err = new Error('Vous ne disposez pas des droits nécessaires pour accéder à cette page ');
            err.status = 401;
            return next(err);
        }
    }
}

module.exports = roleRestriction;