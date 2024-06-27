var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');


const {
  loginPublisher,
  logoutPublisher,
  renderDashboard,
  renderSetBookings,
  setBookingDates,
  deleteDate,
  renderPublisherAccountDetails,
  updatePublisherAccountDetails,
  publisherRequest,
  renderSuccessPage,
  renderCancelPage,
  viewRequest,
  viewLayout,
  renderViewBookings,
  renderRejectBooking,
  rejectBooking,
  renderBookedLayout,
  sendBookedDetails,
  renderSlotsPricing,
  SaveSlotsPricing,
  renderCancelledBookings,
  refundInitiation,
  renderRefundSuccessPage
} = require("../controllers/publisherController");

const urlencodedParser = bodyParser.urlencoded({ extended: true })


const storage = multer.memoryStorage();


// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024,
//   },
// }).single('layout');

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
}).fields([
  { name: 'layout', maxCount: 1 },
  { name: 'publicationId', maxCount: 1 }
]);


router.get('/login', function (req, res, next) {
  res.render('publisherLogin')
});


router.route('/dashboard').get(urlencodedParser, renderDashboard);


router.get('/request', function (req, res, next) {
  res.render('publisherRequest')
});


router.route('/account-details').get(renderPublisherAccountDetails);

router.route('/account-details').post(updatePublisherAccountDetails);

router.route('/set-booking-date').get(renderSetBookings);

router.route('/set-booking-date').post(setBookingDates);

router.route('/close-booking-date/:id').post(deleteDate);

router.route('/view-layout').get(viewLayout);

router.route('/view-bookings').get(renderViewBookings);

router.route('/reject/:booking_id').get(renderRejectBooking);

router.route('/reject/reject-booking').post(rejectBooking);

router.route('/view-cancel-requests').get(renderCancelledBookings)

router.route('/view-layout/:newspaperName/:publishingDate').post(renderBookedLayout);

router.route('/view-layout/:newspaperName/:publishingDate').get(sendBookedDetails);

router.route('/slots-pricing').get(renderSlotsPricing);

router.route('/slots-pricing').post(SaveSlotsPricing);

router.route('/refund/:cancellationId/stripe-checkout').post(refundInitiation);

router.route('/refund/success').get(renderRefundSuccessPage);

router.route('/stripe-checkout').post(upload, publisherRequest);

router.route('/publisher-request/success').get(renderSuccessPage);

router.route('/publisher-request/cancel').get(renderCancelPage);

router.route('/login').post(loginPublisher);

router.route('/logout').get(logoutPublisher)



module.exports = router;
