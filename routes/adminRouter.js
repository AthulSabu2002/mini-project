var express = require('express');
var router = express.Router();
const {
    addPublisher,
    viewPublishers,
    renderDashboard,
    renderAddPublisher,
    deletePublisher,
    deleteRequest,
    viewRequest
    } = require("../controllers/adminController");


router.route('/dashboard').get(renderDashboard);

router.route('/add-publisher').get(renderAddPublisher);

router.route('/view-publishers').get(viewPublishers);

router.route('/view-requests').get(viewRequest);

router.route('/add-publisher').post(addPublisher);

router.route('/delete-request/:id').post(deleteRequest);

router.route('/delete-publisher/:id').post(deletePublisher);

module.exports = router;
