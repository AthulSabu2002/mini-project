var express = require('express');
var router = express.Router();
const {
    addPublisher,
    viewPublishers,
    deletePublisher,
    viewRequest
    } = require("../controllers/adminController");


router.get('/dashboard', function(req, res, next) {
  res.render('adminDashboard', { activeTab: 'dashboard' })
});


router.get('/add-publisher', function(req, res, next) {
    res.render('addPublisher', { activeTab: 'add-publisher' })
});


router.route('/view-publishers').get(viewPublishers);

router.route('/view-requests').get(viewRequest);

router.route('/add-publisher').post(addPublisher);

router.route('/delete-publisher/:id').post(deletePublisher);

module.exports = router;
