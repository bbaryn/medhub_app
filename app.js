const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const db = mongoose.connection;

const routes = require('./routes/index');
const users = require('./routes/users');
const databases = require('./routes/databases');

const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'Shh! It\'s a secret!',
  saveUninitialized: false,
  resave: false,
  cookie: {
    expires: 600000
  }
}));

// const sessionChecker = (req, res, next) => {
//     if (req.session.user && req.cookies.user_sid) {
//         res.redirect('/dashboard');
//     } else {
//         next();
//     }
// };

// app.use((req, res, next) => {
//     if (req.cookies.user_sid && !req.session.user) {
//         res.clearCookie('user_sid');
//     }
//     next();
// });

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
      let namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/users', databases);

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
});

app.listen(port, () => {
  console.log(`Started up on port ${port}`);
});

module.exports = app;
