const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/user-schema');
const roleRestriction = require('../middleware/role-restriction');
const UserRoles = require('../model/user-roles');
const wrap = require('../middleware/promise-wrapper');
const setupOptions = require('../middleware/setup-options');

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 32;

router.get('/login', (req, res) => {
    const options = setupOptions(req, {error: null, data: {}});
    res.render('account/login', options);
});

router.post('/login', wrap(async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.render('account/login', setupOptions(req, { error: 'Merci de préciser l\'email et le mot de passe', data: req.body }));
    } else {
        // authentication
        try {
            const user = await authenticate(req.body.email, req.body.password);
            req.session.userId = user._id;
            req.session.roleId = user.role_id;
            res.redirect('/');
        }
        catch (_) {
            res.render('account/login', setupOptions(req, { error: 'Identifiants invalides', data: req.body }));
        }
    }
}));

router.get('/register', (req, res) => {
    const options = setupOptions(req, { data: {}, errors: null, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH });
    res.render('account/register', options);
});

router.post('/register', wrap(async (req, res, next) => {
    // inserting the unser into the database
    try {
        const user = await insertUser(req);
        // storing the id into the session
        req.session.userId = user._id;
        req.session.roleId = user.role_id;
        res.redirect('/');
    }
    catch (error) {
        // sending the validation errors to the register form
        if (error && error.name === 'ValidationError') {
            const options = setupOptions(req, { data: req.body, errors: error.errors, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH });   
            res.render('account/register', options);
        } else {
            next(error);
        }
    }
}));

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(() => res.redirect('/'));
    } else {
        res.redirect('/');
    }
});

router.get('/roles', roleRestriction(UserRoles.SUPER_ADMIN), wrap(async (req, res) => {
    const users = await User.find();
    const roles = UserRoles;

    res.render('account/roles', setupOptions(req, { users, roles }));
}));

router.post('/roles', roleRestriction(UserRoles.SUPER_ADMIN), wrap(async (req, res) => {
    if (!req.body.user_id || req.body.role_id < 0) {
        res.status(400).send('Invalid request parameters');
    } else {
        await User.updateOne({ _id: req.body.user_id }, { role_id: req.body.role_id });
        res.status(200).send('Success');
    }
}));

async function insertUser(req) {
    const body = req.body;
    const userData = new User();

    userData.firstname = body.firstname;
    userData.email = body.email;
    userData.lastname = body.lastname;
    // setting the role to user by default
    userData.role_id = UserRoles.USER.id;

    // hashing and setting the password to the user if the sent one is valid
    if (body.password && body.password.length >= MIN_PASSWORD_LENGTH && body.password.length <= MAX_PASSWORD_LENGTH) {
        userData.password = await bcrypt.hash(body.password, 10);
    }

    // inserting the user into the database
    await userData.save();
    return userData;
}

async function authenticate(email, password) {
    const user = await User.findOne({ email: email });
    // comparing the passwords using bcrypt
    // if passwords match, setting the user id into the session
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        throw Error("Invalid email or password");
    }

    return user;
}

module.exports = router;