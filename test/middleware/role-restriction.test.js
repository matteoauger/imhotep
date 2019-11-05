const roleRestriction = require('../../middleware/role-restriction');
const UserRoles = require('../../model/user-roles');
const assert = require('assert');

describe('Role restriction', () => {
    it('should grant a super admin in an user restriction', (done) => {
        const next = (err) => {
            // assert that next was called without error
            assert.equal(err, undefined);
            done();
        };
        const req = {
            session: {
                roleId: UserRoles.SUPER_ADMIN.id
            }
        };
        const res = {};
        const restriction = UserRoles.USER;

        const result = roleRestriction(restriction);
        result(req, res, next);
    });

    it('should grant an agent in an user restriction', (done) => {
        const next = (err) => {
            // assert that next was called without error
            assert.equal(err, undefined);
            done();
        };
        const req = {
            session: {
                roleId: UserRoles.AGENT.id
            }
        };
        const res = {};
        const restriction = UserRoles.USER;

        const result = roleRestriction(restriction);
        result(req, res, next);
    });

    it('should not grant an user in an agent restriction', (done) => {
        const next = (err) => {
            // assert that next was called with error
            assert.ok(err);
            done();
        };
        const req = {
            session: {
                roleId: UserRoles.USER.id
            }
        };
        const res = {};
        const restriction = UserRoles.AGENT;

        const result = roleRestriction(restriction);
        result(req, res, next);
    });

    it('should not grant an agent in a super admin restriction', (done) => {
        const next = (err) => {
            // assert that next was called with error
            assert.ok(err);
            done();
        };
        const req = {
            session: {
                roleId: UserRoles.AGENT.id
            }
        };
        const res = {};
        const restriction = UserRoles.SUPER_ADMIN;

        const result = roleRestriction(restriction);
        result(req, res, next);
    });
});