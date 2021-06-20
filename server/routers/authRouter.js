const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require ('../controllers/authController')

// Auth Routes
router.get(
  '/google',
  // (req, res) => res.redirect('/app')
);


router.get(
  '/google/callback',
  passport.authenticate('google', {failureRedirect: '/failed'}),
  function (req, res) {
    res.redirect('/app');
  }
);

module.exports = router;
