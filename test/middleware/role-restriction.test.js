const roleRestriction = require('../../middleware/role-restriction');
const USER_ROLES = require('../../model/user-roles');
const assert = require('assert');

describe('Role restriction', () => {
    it('should grant a super admin in an user restriction', () => {
        const next = (err = null) => {
            // assert that next was called without error
            assert.equal(err, undefined);
        };
        const req = {
            session: {
                roleId: USER_ROLES.super_admin.id
            }
        };
        const res = {};
        const restriction = USER_ROLES.user;

        const result = roleRestriction(restriction);
        result(req, res, next);
    });

    it('should grant an agent in an user restriction', () => {
        const next = (err = null) => {
            // assert that next was called without error
            assert.equal(err, undefined);
        };
        const req = {
            session: {
                roleId: USER_ROLES.agent.id
            }
        };
        const res = {};
        const restriction = USER_ROLES.user;

        const result = roleRestriction(restriction);
        result(req, res, next);
    });

    it('should not grant an user in an agent restriction', () => {
        const next = (err = null) => {
            // assert that next was called without error
            assert.ok(err);
        };
        const req = {
            session: {
                roleId: USER_ROLES.user.id
            }
        };
        const res = {};
        const restriction = USER_ROLES.agent;

        const result = roleRestriction(restriction);
        result(req, res, next);
    });

    it('should not grant an agent in a super admin restriction', () => {
        const next = (err = null) => {
            // assert that next was called without error
            assert.ok(err);
        };
        const req = {
            session: {
                roleId: USER_ROLES.agent.id
            }
        };
        const res = {};
        const restriction = USER_ROLES.super_admin;

        const result = roleRestriction(restriction);
        result(req, res, next);
    });
});