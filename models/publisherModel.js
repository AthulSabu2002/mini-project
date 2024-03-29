const mongoose = require('mongoose');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const publisherSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    organizationName: {
        type: String,
        required: true
    },
    newspaperName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    buildingName: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    advertisementSlots: {
        type: String,
        required: true
    },
    fileFormat: {
        type: String,
        required: true
    },
    paymentmethods: {
        type: String,
        required: true
    },
    customerService: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    bookingDeadline: {
        type: String,
        required: true
    },
    cancellationRefundPolicy: {
        type: String,
        required: true
    },
    contentGuidelines: {
        type: String,
        required: true
    },
    advertisementSubmissionGuidelines: {
        type: String,
        required: true
    },
    cancellationDeadline: {
        type: String,
        required: true
    }
});


publisherSchema.plugin(passportLocalMongoose);

const Publisher = mongoose.model('Publisher', publisherSchema);

passport.use(Publisher.createStrategy());

passport.serializeUser((user, done) => {
    done(null, user.id); // Serialize user ID into the session
});


passport.deserializeUser(async (id, done) => {
    try {
        console.log('Deserializing user with ID:', id);
        const user = await User.findById(id);
        console.log('Deserialized user:', user);
        done(null, user);
    } catch (error) {
        console.error('Error deserializing user:', error);
        done(error);
    }
});



module.exports = Publisher;