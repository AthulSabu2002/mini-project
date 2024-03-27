const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new mongoose.Schema({
    username: String,
    googleId: String,
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    otp: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, {
    timestamps: true,
});

// userSchema.plugin(passportLocalMongoose);

userSchema.plugin(passportLocalMongoose, {
    hashField: 'password' 
});

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

// passport.serializeUser(function(user, done) {
//     done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//     done(null, user);
// });

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = User;