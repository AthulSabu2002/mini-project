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
    viewRequest,
    viewLayout,
    renderViewBookings,
    renderBookedLayout,
    sendBookedDetails
} = require("../controllers/publisherController");

const urlencodedParser = bodyParser.urlencoded({ extended: true })


const storage = multer.memoryStorage();


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
}).single('layout');


router.get('/login', function(req, res, next) {
  res.render('publisherLogin')
});


router.route('/dashboard').get(urlencodedParser, renderDashboard);


router.get('/request', function(req, res, next) {
  res.render('publisherRequest')
});


router.route('/account-details').get(renderPublisherAccountDetails);

router.route('/account-details').post(updatePublisherAccountDetails);

router.route('/set-booking-date').get(renderSetBookings);

router.route('/set-booking-date').post(setBookingDates);

router.route('/close-booking-date/:id').post(deleteDate);

router.route('/view-layout').get(viewLayout);

router.route('/view-bookings').get(renderViewBookings);

router.route('/view-layout/:newspaperName/:publishingDate').post(renderBookedLayout);

router.route('/view-layout/:newspaperName/:publishingDate').get(sendBookedDetails);


router.route('/request').post(upload, publisherRequest);

router.route('/login').post(loginPublisher);

router.route('/logout').get(logoutPublisher)



module.exports = router;
