const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Register' });
});

router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Login' });
});

router.post('/login',
  passport.authenticate('local', {failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}), (req, res) => {
    req.flash('success', 'You are now logged in');
    res.redirect('/');
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy((username, password, done) => {
  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if (!user) {
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) return done;
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid password'});
      }
    });
  });
}));

router.post('/register', (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    const newUser = new User({
      name,
      username,
      email,
      password
    });

    User.createUser(newUser, (err, user) => {
      if(err) throw err;
      console.log(user);
    });

    req.flash('success', 'You are now registed and can login');

    res.location('/');
    res.redirect('/');
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
});

module.exports = router;
