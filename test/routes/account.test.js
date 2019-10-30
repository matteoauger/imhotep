const request = require('supertest');
const assert = require('assert');
const app = require('../../app');
const User = require('../../model/user-schema');
const bcrypt = require('bcrypt');
const { MongoMemoryServer } = require('mongodb-memory-server');
const USER_ROLES = require('../../model/user-roles');

const mongoServer = new MongoMemoryServer();

const mongoose = require('mongoose');

/**
 * Integration Testing the account routes
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

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
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
            testUser.role_id = USER_ROLES.user.id;
            
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
            testUser.role_id = USER_ROLES.user.id;
            
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

    describe('Register page', () => {
        it('should return (200) OK', async () => {
            const res = await request(app)
                .get('/account/register');
            
            assert.equal(res.statusCode, 200);
            assert.equal(res.type, 'text/html');
        });
    });

    describe('Register', () => {
        it('should create a user with valid data', async () => {
            const data = {
                email: "test-register@test.com",
                firstname: "test register 1",
                lastname: "test",
                password: "iA?tIsSqlA=EypAcarH{EusVcO4OrvIr"
            };

            const res = await request(app)
                .post('/account/register')
                .send(data);

            const usr = await User.findOne({email: data.email});

            assert.equal(usr.firstname, data.firstname);
            assert.equal(usr.lastname, data.lastname);
            assert.ok(bcrypt.compareSync(data.password, usr.password));
            assert.equal(usr.role_id, USER_ROLES.user.id);
            assert.ok(res.header['set-cookie']);
        });

        it('should not register with missing data', async () => {
            const data = {
                email: "test-register@test.com",
                lastname: "test",
            };

            const res = await request(app)
                .post('/account/register')
                .send(data);

            const usr = await User.findOne({email: data.email});


            assert.equal(res.status, 200);
            assert.equal(usr, undefined);
            assert.equal(res.header['set-cookie'], undefined);
        });

        it('should not register with invalid email', async () => {
            const data = {
                email: "test-regist",
                lastname: "test",
                firstname: "a",
                password: "iA?tIsSqlA=EypAcarH{EusVcO4OrvIr"
            };

            const res = await request(app)
                .post('/account/register')
                .send(data);

            const usr = await User.findOne({email: data.email});

            assert.equal(res.status, 200);
            assert.equal(usr, undefined);
            assert.equal(res.header['set-cookie'], undefined);
        });

        it('should not register with invalid password', async () => {
            const data = {
                email: "test@test.com",
                lastname: "test",
                firstname: "test",
                password: "test"
            };

            const res = await request(app)
                .post('/account/register')
                .send(data);
            
            const usr = await User.findOne({email: data.email});

            assert.equal(res.status, 200);
            assert.equal(usr, undefined);
            assert.equal(res.header['set-cookie'], undefined);
        }); 
    });

    describe('Role managment', () => {
        const userData = {
            email: "test@test.com",
            firstname: "test",
            lastname: "test",
            password: "testtest"        
        }

        /**
         * Registering an user before each test on this section
         * The registered user will be used because this section works with authentication.
         */
        beforeEach(async () => {
            const registerRes = await request(app)
                .post('/account/register')
                .send(userData)

            if (registerRes.status !== 302) {
                assert.fail("Couldn't register the test user for testing role managment route.")
            }
        });

        describe('Role managment page', () => {
            it('should return 200 if the user is a superadmin', async () => {
                // granting super admin access to the test user
                await User.updateOne({email: userData.email}, {role_id: USER_ROLES.super_admin.id});
    
                const loginRes = await request(app)
                    .post('/account/login')
                    .send({email: userData.email, password: userData.password});

                const cookie = loginRes.header['set-cookie'][0];
                const cookieValue = cookie.split(';')[0];
    
                const res = await request(app)
                    .get('/account/roles')
                    .set('Cookie', cookieValue)
                    .send();
    
                assert.equal(res.statusCode, 200);
                assert.equal(res.type, 'text/html');
            });
    
            it('should not grant access to an unauthorized user', async () => {
                const loginRes = await request(app)
                    .post('/account/login')
                    .send({email: userData.email, password: userData.password});
                
                
                const cookie = loginRes.header['set-cookie'][0];
                const cookieValue = cookie.split(';')[0];
    
                const res = await request(app)
                    .get('/account/roles')
                    .set('Cookie', cookieValue)
                    .send();
    
                assert.equal(res.statusCode, 401);
                assert.equal(res.type, 'text/html');
            });
        });

        describe('Role managment POST', () => {
            it('should not grant access to a user', async () => {
                const loginRes = await request(app)
                    .post('/account/login')
                    .send({email: userData.email, password: userData.password});
                
                const cookie = loginRes.header['set-cookie'][0];
                const cookieValue = cookie.split(';')[0];
    
                const res = await request(app)
                    .post('/account/roles')
                    .set('Cookie', cookieValue)
                    .send({role_id: 0, user_id: ""});
    

                let user = await User.findOne({email: userData.email});
    
                assert.equal(res.statusCode, 401);
                assert.equal(user.role_id, USER_ROLES.user.id);            
            });

            it('should respond (400) BAD REQUEST with invalid data', async () => {
                // granting super admin access to the test user
                await User.updateOne({email: userData.email}, {role_id: USER_ROLES.super_admin.id});

                const loginRes = await request(app)
                    .post('/account/login')
                    .send({email: userData.email, password: userData.password});
                
                const cookie = loginRes.header['set-cookie'][0];
                const cookieValue = cookie.split(';')[0];

                let user = await User.findOne({email: userData.email});
    
                const res = await request(app)
                    .post('/account/roles')
                    .set('Cookie', cookieValue)
                    .send({
                        user_id: user._id,
                        role_id: -1
                });

                user = await User.findOne({email: userData.email});
    
                assert.equal(res.statusCode, 400);
                assert.equal(user.role_id, USER_ROLES.super_admin.id);
            });

            it('should change the user role with valid parameters and authorization', async () => {
                // granting super admin access to the test user
                await User.updateOne({email: userData.email}, {role_id: USER_ROLES.super_admin.id});

                const loginRes = await request(app)
                    .post('/account/login')
                    .send({email: userData.email, password: userData.password});
                
                const cookie = loginRes.header['set-cookie'][0];
                const cookieValue = cookie.split(';')[0];

                let user = await User.findOne({email: userData.email});
    
                const res = await request(app)
                    .post('/account/roles')
                    .set('Cookie', cookieValue)
                    .send({
                        user_id: user._id,
                        role_id: USER_ROLES.agent.id
                    });
                
                user = await User.findOne({email: userData.email});

                assert.equal(res.statusCode, 200);
                assert.equal(user.role_id, USER_ROLES.agent.id);
            });
        });
    });


    describe('Logout', () => {
        it('should redirect', async () => {
            const res = await request(app)
                .get('/account/logout');

            assert.equal(res.header['set-cookie'], undefined);
            assert.equal(res.statusCode, 302);
        });
    });
});