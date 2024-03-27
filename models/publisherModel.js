const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    newspaperName: {
        type: String,
        required: true,
        unique: true
    },
    language: {
        type: String,
        required: true
    }
});

const Publisher = mongoose.model('Publisher', publisherSchema);

module.exports = Publisher;
