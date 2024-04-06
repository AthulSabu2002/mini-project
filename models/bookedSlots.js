const mongoose = require('mongoose');

// Define the schema for booked slots
const bookedSlotSchema = new mongoose.Schema({
    userId: {
        type: String,
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const BookedSlot = mongoose.model('BookedSlot', bookedSlotSchema);

module.exports = BookedSlot;
