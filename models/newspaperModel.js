const mongoose = require('mongoose');

const newspaperSlotSchema = new mongoose.Schema({
  slot_html_id: {
    type: String,
    required: true
  },
  dimensions: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  price: {
    type: Number,
    required: true
  },
  specifications: {
    type: Object 
  }
});

const newspaperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slots: [newspaperSlotSchema]
});

module.exports = mongoose.model('NewspaperDetails', newspaperSchema);
