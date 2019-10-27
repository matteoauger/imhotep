const request = require('supertest');
const assert = require('assert');
const app = require('../../app');
const User = require('../../model/user-schema');
const bcrypt = require('bcrypt');

const mongoose = require('mongoose');

/**
 * Testing the account routes
 */
describe('Account routes', () => {
    /**
     * Connecting to a test database
     * Don't mock what you don't own ;)
     */
    before(() => {
        mongoose.connect('mongodb://localhost/_testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).catch(() => {
            console.error.bind(console, 'connection error');
            assert.fail('Connection to mongodb couldn\'t be established');
        });

        const db = mongoose.connection;
        
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', async () => {
            console.log('Connection to the test database is successfully established');
        });
    });

    describe('Login page', () => {
        it('should return (200) OK', async () => {
            const res = await request(app)
                .get('/account/login');

            assert.equal(res.statusCode, 200);
            assert.equal(res.type, 'text/html');
        });
    });

    describe('Authentication', () => {
        it('should login, set cookie to session id and redirect', async () => {
            // inserting the test user in the database
            const testUser = new User();
            const pass = "test";
            testUser.email = "test@test.com"; 
            testUser.firstname = "test"; 
            testUser.lastname = "test";
            testUser.password = await bcrypt.hash(pass, 10);
            testUser.role_id = 0;
            
            await testUser.save();

            const res = await request(app)
                .post('/account/login')
                .send({email: testUser.email, password: pass});

            assert.equal(res.statusCode, 302);
            assert.ok(res.header['set-cookie'])
        });

        it('should not login with invalid credentials', async () => {
            const testUser = new User();
            testUser.email = "test2@test.com"; 
            testUser.firstname = "test2"; 
            testUser.lastname = "test2";
            testUser.password = await bcrypt.hash("test", 10);
            testUser.role_id = 0;
            
            await testUser.save();

            const res = await request(app)
                .post('/account/login')
                .send({email: testUser.email, password: "test2"});
            
            assert.equal(res.statusCode, 200);
            assert.equal(res.header['set-cookie'], undefined);
        });

        it('should not login with missing credentials', async () => {
            const res = await request(app)
                .post('/account/login')
                .send({email: "test@test.com"});
            
            assert.equal(res.statusCode, 200);
            assert.equal(res.header['set-cookie'], undefined);
        });
    }); 

    describe('Logout', () => {
        it('should return (302) REDIRECT', async () => {
            const res = await request(app)
                .get('/account/logout');
            
            assert.equal(res.statusCode, 302);
        });
    });

    /**
     * Dropping the test database
     */
    after(done => {
        mongoose.connection.db
        .dropDatabase()
        .then(() => mongoose.connection.close(done));
    });
});