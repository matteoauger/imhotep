const assert = require('assert');
const setupOptions = require('../../middleware/setup-options');


describe('Setup option middleware', () => {
    it('should setup the options with a role in the session', () => {
        const options = { test: 'test' };

        const req = { session: { roleId: 0 }};

        const result = setupOptions(req, options);
        assert.equal(result.roleId, options.roleId);
        assert.equal(result.test, options.test);
    });

    it('should render the view with a role set to -1', () => {
        const options = { test: 'test' };

        const req = { session: {}};

        const result = setupOptions(req, options);
        assert.equal(result.roleId, -1);
        assert.equal(result.test, options.test);
    });
});