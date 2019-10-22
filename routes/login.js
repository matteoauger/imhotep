const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/user-schema');

router.get('/login', (req, res, next) => {
  res.render('user/login', { title: 'Se connecter' });
});

router.post('/login', (req, res, next) => {
  throw Error("not implemented");
});

router.get('/register', (req, res, next) => {
  res.render('user/register', { title: 'Créer un compte', data: null, error: ""  });
});

router.post('/register', (req, res, next) => {
  if (req.body.email && 
      req.body.firstname && 
      req.body.lastname && 
      req.body.password) {

      // hashing the password using bcrypt
      const pass = req.body.password;
      bcrypt.hash(pass, 10)
        .then(hash => insertUser(hash, req, res))
        .catch(_ => res.redirect("/error"));
  } else {
    res.render('user/register', { title: 'Créer un compte', data: req.body, error: "Merci de renseigner la totalité des champs." });
  }
});

function insertUser(hashedPassword, req, res) {
  const body = req.body;
  const userData = new User();

  userData.firstname = body.firstname;
  userData.email = body.email,
  userData.lastname = body.lastname,
  userData.password = hashedPassword

  // inserting the user into the database
  // once done, redirecting to the index route or error route
  userData.save()
    .then(_ => res.redirect('/'))
    .catch(_ => res.render('user/register', { title: 'Créer un compte', data: req.body, error: "Erreur lors de la création du compte. Merci de vérifier les données fournies." }));
}

module.exports = router;