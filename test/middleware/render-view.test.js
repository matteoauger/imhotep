const assert = require('assert');
const renderView = require('../../middleware/render-view');


describe('View renderer middleware', () => {
    it('should render the view with a role in the session', () => {
        const viewPath = 'test';
        const viewData = {test: "test"};

        const req = { session: { roleId: 0 }};
        const res = {
            render: (path, options) => {
                assert.equal(path, viewPath);
                assert.equal(options.roleId, req.session.roleId);
                assert.equal(options.test, viewData.test);
            }
        };        

        renderView(req, res, viewPath, viewData);
    });

    it('should render the view with a role set to -1', () => {
        const viewPath = 'test';
        const viewData = {test: "test"};

        const req = {};
        const res = {
            render: (path, options) => {
                assert.equal(path, viewPath);
                assert.equal(options.roleId, -1);
                assert.equal(options.test, viewData.test);
            }
        };        

        renderView(req, res, viewPath, viewData);
    });
});