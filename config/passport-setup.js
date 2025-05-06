const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv').config();
const User = require('../models/userModel');

// Update serialization to use user.id
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err));
});

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID, // Update env variable name
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Update env variable name
        callbackURL: process.env.GOOGLE_CALLBACK_URL, // Update env variable name
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
            const currentUser = await User.findOne({ googleId: profile.id });
            if (currentUser) {
                return done(null, currentUser);
            }

            const userWithEmail = await User.findOne({ 
                email: profile.emails ? profile.emails[0].value : null 
            });
            
            if (userWithEmail) {
                userWithEmail.googleId = profile.id;
                const updatedUser = await userWithEmail.save();
                console.log('Existing user updated with Google ID');
                return done(null, updatedUser);
            }

            const newUser = await new User({
                username: profile.displayName,
                googleId: profile.id,
                email: profile.emails ? profile.emails[0].value : null
            }).save();
            
            console.log('New user saved to database');
            return done(null, newUser);
        } catch (err) {
            return done(err);
        }
    })
);

module.exports = router;
