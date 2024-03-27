var express = require('express');
var router = express.Router();

const {
    publisherRequest,
    viewRequest
    } = require("../controllers/publisherController");


router.get('/login', function(req, res, next) {
  res.render('publisherLogin')
});


router.get('/dashboard', function(req, res, next) {
  res.render('publisherDashboard', { activeTab: 'dashboard' })
});


router.get('/request', function(req, res, next) {
  res.render('publisherRequest')
});


router.route('/request').post(publisherRequest);

module.exports = router;
