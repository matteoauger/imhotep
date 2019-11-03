/**
 * Sets the role id into view data and renders the view which path is specified.
 * @param {*} req request
 * @param {*} res response
 * @param {*} path view path
 * @param {*} options view data
 */
function renderView(req, res, path, options) {
    const viewData = options;
    let roleId = -1;

    if (req.session && req.session.roleId > -1) {
        roleId = req.session.roleId;
    }

    viewData.roleId = roleId;
    return res.render(path, viewData);
}

module.exports = renderView;