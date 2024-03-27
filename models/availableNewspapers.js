const mongoose = require('mongoose');

const newspaperSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const Newspaper = mongoose.model('Newspaper', newspaperSchema);

module.exports = Newspaper;
