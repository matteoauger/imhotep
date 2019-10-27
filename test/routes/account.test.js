const request = require('supertest');
const assert = require('assert');
const app = require('../../app');


/**
 * Testing the account routes
 */
describe('Account routes', () => {
    describe('Login page', () => {
        it('should return (200) OK', async () => {
            const res = await request(app)
                .get('/account/login');
            
            assert.equal(res.statusCode, 200);
            assert.equal(res.type, 'text/html');
        });
    });

    // describe('Authentication', () => {
    //     it('should login', async () => {
    //         const res = await request(app)
    //             .post('/account/login')
    //             .send({email: "matteo.auger@etu.univ-lehavre.fr", password: "testtest"});
            

    //         const cookie = testSession.cookies.find(cookie => cookie.name === 'connect.sid');
    //         console.log(cookie);

    //         assert.equal(res.statusCode, 200);
    //         assert.equal(res.type, 'text/html');
    //     });
    // });

    describe('Logout', () => {
        it('should return (302) REDIRECT', async () => {
            const res = await request(app)
                .get('/account/logout');
            
            assert.equal(res.statusCode, 302);
        });

        // it('should destroy session', async () => {
        //     const res = await request(app)
        //         .get('/account/logout');
            
        //     const cookie = testSession.cookies.find(cookie => cookie.name === 'connect.sid');
        //     assert.equal(cookie, null);
        // });
    });
});