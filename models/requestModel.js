// requestModel.js
const mongoose = require('mongoose');

// Define the schema for publisher request
const requestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    newspaper: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the model based on the schema
const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
