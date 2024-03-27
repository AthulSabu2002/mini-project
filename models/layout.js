const mongoose = require('mongoose');

const imageWithModificationsSchema = new mongoose.Schema({
    imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true },
    imageData: { type: String, required: true },
    modificationsData: {
        regions: [{
            startX: Number,
            startY: Number,
            endX: Number,
            endY: Number,
            name: String,
            text: String
        }],
        bookingStartDate: String,
        bookingCloseDate: String
    }
});

const ImageWithModifications = mongoose.model('ImageWithModifications', imageWithModificationsSchema);

module.exports = ImageWithModifications;
