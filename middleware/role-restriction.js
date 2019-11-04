const createError = require('http-errors');

function roleRestriction(role) {
    return function(req, res, next) {
        if (req.session && req.session.roleId <= role.id) {
            return next();
        } else {
            return next(createError(403)); // Denied Accesses
        }
    }
}

module.exports = roleRestriction;