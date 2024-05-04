const mongoose = require('mongoose');

const refundedSlotSchema = new mongoose.Schema({
        userId: {
            type: String,
            required: true
        },
        publishingDate: {
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
        cancellationSessionId:{
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    });


const refundedBookings = mongoose.model('refundedBookings', refundedSlotSchema);

module.exports = refundedBookings;
