/**
 * Setup the view options with shared data.
 * @param {object} req request 
 * @param {object} [options] data
 * @returns {object} options
 */
function setupOptions(req, options = {}) {
    let roleId = -1;
    if (req.session && req.session.roleId > -1) {
        roleId = req.session.roleId;
    }
    options.roleId = roleId;
    return options;
}

module.exports = setupOptions;