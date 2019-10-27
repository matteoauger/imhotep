const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/user-schema');
const roleRestriction = require('../middleware/role-restriction');
const USER_ROLES = require('../model/user-roles');

router.get('/login', (req, res) => {
    res.render('account/login', { error: null, data: null });
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
            .catch(() => res.render('account/login', { error: 'Identifiants invalides', data: req.body }));
    } else {
        res.render('account/login', { error: 'Merci de préciser l\'email et le mot de passe', data: req.body });
    }
});

router.get('/register', (req, res) => {
    res.render('account/register', { data: null, error: "" });
});

router.post('/register', (req, res) => {
    if (req.body.email &&
        req.body.firstname &&
        req.body.lastname &&
        req.body.password) {
        // inserting the unser into the database
        insertUser(req)
            .then(user => {
                // storing the id into the session
                req.session.userId = user._id;
                req.session.roleId = user.role_id;
                res.redirect('/');
            })
            .catch(err =>
                res.render('account/register', { data: req.body, error: `Le compte associé à ${req.body.email} existe déjà.` })
            );
    } else {
        res.render('account/register', { data: req.body, error: "Merci de renseigner la totalité des champs." });
    }
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
    
    res.render('account/roles', { users, roles });
});

router.post('/roles', roleRestriction(USER_ROLES.super_admin), async (req, res) => {
    if (req.body.user_id && req.body.role_id >= 0) {
        const rslt = await User.updateOne({_id: req.body.user_id}, {role_id: req.body.role_id});
        res.status(200).send('Success');
    } else {
        // bad request
        res.status(400).send('Invalid request parameters');
    }
});

async function insertUser(req) {
    const body = req.body;
    const userData = new User();
    const hashedPassword = await bcrypt.hash(body.password, 10);

    userData.firstname = body.firstname;
    userData.email = body.email;
    userData.lastname = body.lastname;
    userData.password = hashedPassword;
    // setting the role to user by default
    userData.role_id = USER_ROLES.user.id;

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