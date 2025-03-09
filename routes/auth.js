var express = require('express');
var router = express.Router();
const passport = require('passport');
const passportSetup = require('../config/passport-setup');

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account'
}));

router.get('/google/redirect', 
    passport.authenticate('google', { 
        failureRedirect: '/auth/login',
        failureFlash: true 
    }), 
    (req, res) => {
        if (!req.user) {
            return res.redirect('/auth/login');
        }
        
        const userId = req.user._id.toString();
        req.session.loggedIn = true;
        res.cookie('userId', userId, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
        res.redirect('/users/dashboard/');
    }
);

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.loggedIn = false;
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
            }
            res.redirect('/auth/login');
        });
    });
});

module.exports = router;