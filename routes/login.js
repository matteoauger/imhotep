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
    authenticate(req, res, req.body.email, req.body.password)
      .then(_ => res.redirect('/'))
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
      // hashing the password using bcrypt
      const pass = req.body.password;
      insertUser(pass, req, res)
        .then(_ => res.redirect('/'))
        .catch(_ => 
          res.render('user/register', { title: 'Créer un compte', data: req.body, error: "Erreur lors de la création du compte. Merci de vérifier les données fournies." })
        );
  } else {
    res.render('user/register', { title: 'Créer un compte', data: req.body, error: "Merci de renseigner la totalité des champs." });
  }
});

async function insertUser(password, req) {
  const body = req.body;
  const userData = new User();
  const hashedPassword = await bcrypt.hash(password, 10);

  userData.firstname = body.firstname;
  userData.email = body.email,
  userData.lastname = body.lastname,
  userData.password = hashedPassword

  // inserting the user into the database
  await userData.save();

  // storing the id in the session
  req.session.userId = userData._id;
}

async function authenticate(req, res, email, password) {
  const user            = await User.findOne({email: email });
  const hashedPassword  = await bcrypt.hash(password, 10);
  // comparing the passwords using bcrypt
  // if passwords match, setting the user id into the session
  const passwordMatches = await bcrypt.compare(hashedPassword, user.password);

  if (passwordMatches) {
    req.session.userId = user._id;
  } else {
    throw Error("Invalid credentials");
  }
}

module.exports = router;