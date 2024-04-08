const mongoose = require('mongoose');

const bookingDatesSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publisher',
    required: true
  },
  publishingDate: {
    type: Date,
    required: true
  },
  bookingOpenDate: {
    type: Date,
    required: true
  },
  bookingCloseDate: {
    type: Date,
    required: true
  }
});

const BookingDates = mongoose.model('BookingDates', bookingDatesSchema);

module.exports = BookingDates;
