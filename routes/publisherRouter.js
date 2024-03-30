var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');


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
    viewLayout
} = require("../controllers/publisherController");

const urlencodedParser = bodyParser.urlencoded({ extended: true })



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

router.route('/request').post(publisherRequest);

router.route('/login').post(loginPublisher);

router.route('/logout').get(logoutPublisher)



module.exports = router;