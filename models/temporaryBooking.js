const mongoose = require('mongoose');

const temporaryBookingSchema = new mongoose.Schema({
        tempUserId: {
            type: String,
            required: true
        },
        publishingDate: {
            type: Date,
            required: true
        },
        lastDateOfCancellation: {
            type: Date,
            required: true
        },
        slotId: {
            type: String,
            required: true
        },
        newspaperName: {
            type: String,
            required: true
        },
        file: {
            data: Buffer,
            contentType: String
        },
        price: {
            type: Number,
            required: true
        },
        sessionId: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    });


const TemporaryBooking = mongoose.model('TemporaryBooking', temporaryBookingSchema);

module.exports = TemporaryBooking;
