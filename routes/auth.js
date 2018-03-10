const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
router.get('/auth/google/redirect',passport.authenticate('google'),(req, res) => {
    res.redirect('/profile');
});

module.exports = router;