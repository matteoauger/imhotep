const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/user-schema');
const roleRestriction = require('../middleware/role-restriction');
const USER_ROLES = require('../model/user-roles');
const renderView = require('../middleware/render-view');

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 32;

router.get('/login', (req, res) => {
    renderView(req, res, 'account/login', { error: null, data: {} });
});

router.post('/login', (req, res) => {
    if (req.body.email && req.body.password) {
        // authentication
        authenticate(req.body.email, req.body.password)
            .then(user => {
                req.session.userId = user._id;
                req.session.roleId = user.role_id;
                res.redirect('/');
            })
            .catch(() => renderView(req, res, 'account/login', { error: 'Identifiants invalides', data: req.body }));
    } else {
        renderView(req, res, 'account/login', { error: 'Merci de préciser l\'email et le mot de passe', data: req.body });
    }
});

router.get('/register', (req, res) => {
    renderView(req, res, 'account/register', { data: {}, errors: null, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH});
});

router.post('/register', (req, res, next) => {
    // inserting the unser into the database
    insertUser(req)
        .then(user => {
            // storing the id into the session
            req.session.userId = user._id;
            req.session.roleId = user.role_id;
            res.redirect('/');
        })
        .catch(error => {
            // sending the validation errors to the register form
            if (error && error.name === 'ValidationError')
                renderView(req, res, 'account/register', { data: req.body, errors: error.errors, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH});
            else
                next(error);
        });
});

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(() => res.redirect('/'));
    } else {
        res.redirect('/');
    }
});

router.get('/roles', roleRestriction(USER_ROLES.super_admin), async (req, res) => {
    const users = await User.find();
    const roles = USER_ROLES;

    renderView(req, res, 'account/roles', { users, roles });
});

router.post('/roles', roleRestriction(USER_ROLES.super_admin), async (req, res) => {
    if (req.body.user_id && req.body.role_id >= 0) {
        await User.updateOne({ _id: req.body.user_id }, { role_id: req.body.role_id });
        res.status(200).send('Success');
    } else {
        // bad request
        res.status(400).send('Invalid request parameters');
    }
});

async function insertUser(req) {
    const body = req.body;
    const userData = new User();

    userData.firstname = body.firstname;
    userData.email = body.email;
    userData.lastname = body.lastname;
    // setting the role to user by default
    userData.role_id = USER_ROLES.user.id;

    // hashing and setting the password to the user if the sent one is valid
    if (body.password && body.password.length >= MIN_PASSWORD_LENGTH && body.password.length <= MAX_PASSWORD_LENGTH) {
        userData.password = await bcrypt.hash(body.password, 10)
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

    if (passwordMatches) {
        return user;
    }

    throw Error("Invalid email or password");
}

module.exports = router;