const mongoose = require('mongoose');

const SlotInitializationSchema = new mongoose.Schema({
    newspaperName: {
        type: String,
        required: true
    },
    slots: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const SlotPrices = mongoose.model('SlotPrices', SlotInitializationSchema);

module.exports = SlotPrices;
