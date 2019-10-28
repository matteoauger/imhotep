const request = require('supertest');
const assert = require('assert');
const app = require('../../app');
const User = require('../../model/user-schema');
const bcrypt = require('bcrypt');
const mms = require('mongodb-memory-server');

const mongoServer = new mms.MongoMemoryServer({
    instance: {
        ip: 'mongo'
    }
});

const mongoose = require('mongoose');

// TODO 
// MOCK MONGODB
// https://github.com/nodkz/mongodb-memory-server

/**
 * Testing the account routes
 */
describe('Account routes', () => {
    /**
     * Connecting to a memory database for fast tests
     */
    before(async () => {
        const mongoUri = await mongoServer.getConnectionString();
        const mongooseOpts = {
            // options for mongoose 4.11.3 and above
            autoReconnect: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000,
            useNewUrlParser: true,
            useUnifiedTopology: true
          };
        
          mongoose.connect(mongoUri, mongooseOpts);
        
          mongoose.connection.on('error', (e) => {
            if (e.message.code === 'ETIMEDOUT') {
              console.log(e);
              mongoose.connect(mongoUri, mongooseOpts);
            }
            console.log(e);
          });
        
          mongoose.connection.once('open', () => {
            console.log(`MongoDB successfully connected to ${mongoUri}`);
          });
    });

    /**
     * Disconnecting memory database
     */
    after(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
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
});