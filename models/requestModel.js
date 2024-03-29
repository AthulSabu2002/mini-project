// requestModel.js
const mongoose = require('mongoose');

// Define the schema for publisher request
const requestSchema = new mongoose.Schema({
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
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the model based on the schema
const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
