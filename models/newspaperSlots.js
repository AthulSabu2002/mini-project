const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    slotName: {
        type: String,
        required: true
    },
});

const newspaperSchema = new mongoose.Schema({
    newspaperName: {
        type: String,
        required: true,
        unique: true
    },
    slots: [slotSchema] 
});

const Newspaper = mongoose.model('Newspaper', newspaperSchema);

module.exports = Newspaper;
