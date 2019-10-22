const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/user-schema');

router.get('/login', (req, res) => {
  res.render('user/login', {error: null, data: null});
});

router.post('/login', (req, res) => {
  if (req.body.email && req.body.password) {
    // authentication
    authenticate(req.body.email, req.body.password)
      .then(user => {
        if (user) {
          req.session.userId = user._id;
        }
        res.redirect('/');
      })
      .catch(_ => res.render('user/login', { error: 'Identifiants invalides', data: req.body }));
  } else {
    res.render('user/login', { error: 'Merci de préciser l\'email et le mot de passe', data: req.body });
  }
});

router.get('/register', (req, res) => {
  res.render('user/register', { data: null, error: ""  });
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
          res.redirect('/');
        })
        .catch(_ => 
          res.render('user/register', { title: 'Créer un compte', data: req.body, error: `Le compte associé à ${req.body.email} existe déjà.` })
        );
  } else {
    res.render('user/register', { title: 'Créer un compte', data: req.body, error: "Merci de renseigner la totalité des champs." });
  }
});

router.get('/logout', (req, res) => {
  if (req.session && req.session.userId) {
    req.session.destroy(_ => res.redirect('/'));
  } else {
    res.redirect('/');
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

  // inserting the user into the database
  await userData.save();

  return userData;
}

async function authenticate(email, password) {
  const user            = await User.findOne({email: email });
  // comparing the passwords using bcrypt
  // if passwords match, setting the user id into the session
  const passwordMatches = await bcrypt.compare(password, user.password);
  return passwordMatches ? user : null;
}

module.exports = router;