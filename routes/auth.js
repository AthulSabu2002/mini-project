var express = require('express');
var router = express.Router();
const passport = require('passport');
const passportSetup = require('../config/passport-setup');

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/google', passport.authenticate('google',{
    scope: ['email','profile']
}))


router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    if (req.user) {
        const googleId = req.user.googleId;
        const requserId = req.user._id;
        const userId = requserId.toString();
        console.log(userId);
        if (googleId) {
            req.session.loggedIn = true;
            res.cookie('userId', userId, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true
            });
            res.redirect('/users/dashboard/')
        }
    }
})



router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.loggedIn = false;
        req.session.destroy()
        res.redirect('/auth/login')
      });
})

module.exports = router;