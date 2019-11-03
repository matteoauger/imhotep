const request = require('supertest');
const assert = require('assert');
const app = require('../../app');

/**
 * Testing the index route
 */
describe('Index route', () => {
    it('should return (200) OK', async () => {
        const res = await request(app)
            .get('/');
                    
        assert.equal(res.statusCode, 200);
        assert.equal(res.type, 'text/html');
    });

    it('should send a response containing login and register buttons', async () => {
        const res = await request(app)
            .get('/');

        assert.ok(res.text.includes('href="/account/login"'));
        assert.ok(res.text.includes('href="/account/register'));
        assert.ok(!res.text.includes('href="/account/logout"'));
    });
    
    it('should return (404) NOT FOUND on non-existing route', async () => {
        const res = await request(app)
            .get('/a/b/c');
        
        assert.equal(res.statusCode, 404);
    });
});
