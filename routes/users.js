const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


// Bring in User Model
let User = require('../models/user');

// Express Middleware for loggedIn
function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/users/login');
  }
}

// Register Form
router.get('/register', loggedIn, (req, res) => {
  res.render('register');
});

// Register Process
router.post('/register', loggedIn, (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors,
    });
  } else {
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });
    // We generate a salt for the password
    bcrypt.genSalt(10, (err, salt) => {
      // We crypt the password with the salt and the plaintext
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          console.log(err);
        }
        // The password is not hashed
        newUser.password = hash;
        newUser.save((err) => {
          if (err) {
            console.log(err);
	    return;
          } else {
            req.flash('success', 'You are now registered and can log in');
            res.redirect('/users/login');
	  }
        });
      });
    });
  }
});

// Login Form
router.get('/login', (req, res) => {
  res.render('login');
});

// Login Process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});


// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/');
});

module.exports = router;
