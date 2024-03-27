const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  originalName: { type: String, required: true }, 
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  data: { type: Buffer, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true }); 

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
