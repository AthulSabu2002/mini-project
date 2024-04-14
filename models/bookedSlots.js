const mongoose = require('mongoose');

const bookedSlotSchema = new mongoose.Schema({
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
        sessionId: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    });


const BookedSlot = mongoose.model('BookedSlot', bookedSlotSchema);

module.exports = BookedSlot;
