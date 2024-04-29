const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const adminSchema = new mongoose.Schema({
    username: String,
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

adminSchema.plugin(passportLocalMongoose);

const Admin = mongoose.model("Admin", adminSchema);

passport.use(Admin.createStrategy());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Admin.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = Admin;
