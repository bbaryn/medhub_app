const express = require('express');
const router = express.Router();

const Data = require('../models/databases');

router.get('/databases', (req, res, next) => {
  res.render('databases', { title: 'Database' });
});

router.post('/databases', (req, res, next) => {
  const dateofbirth = req.body.dateofbirth;
  const pesel = req.body.pesel;
  const address = req.body.address;
  const postalcode = req.body.postalcode;
  const city = req.body.city;

  req.checkBody('dateofbirth', 'Name field is required').notEmpty();
  req.checkBody('pesel', 'Email field is required').notEmpty();
  req.checkBody('address', 'Email is not valid').notEmpty();
  req.checkBody('postalcode', 'Username field is required').notEmpty();
  req.checkBody('city', 'Password field is required').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    res.render('databases', {
      errors: errors
    });
  } else {
    const newData = new Data({
      dateofbirth,
      pesel,
      address,
      postalcode,
      city
    });

    newData.save();

    req.flash('success', 'You are send your data correctly');

    res.location('/');
    res.redirect('/');
  }
});

module.exports = router;
