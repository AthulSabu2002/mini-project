const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Admin = require('../models/adminModel');
const {
    loginAdmin,
    addPublisher,
    viewPublishers,
    viewRequest,
    viewPublisherDetails,
    renderDashboard,
    renderAddPublisher,
    renderNewspaperSlots,
    deletePublisher,
    deleteRequest,
    renderSaveAddSlots,
    saveAdSlots,
    logoutAdmin
    } = require("../controllers/adminController");


const bodyParser = require("body-parser");
        
const urlencodedParser = bodyParser.urlencoded({ extended: true })

const authCheck = asyncHandler(async (req, res, next) => {
    const userId = req.cookies.userId;
    if (!userId) {
        return res.redirect('/admin/login'); 
    }

    const user = await Admin.findById(userId);
    if (!user) {
        return res.redirect('/admin/login'); 
    } 
    else{
      next()
    }
});

router.route("/login").get((req,res) => {
    try{
        res.render("admin_login");
    }
    catch(err){
        res.send(err);
    }
});

router.route("/login").post(urlencodedParser, loginAdmin);

router.route('/dashboard').get(authCheck, renderDashboard);

router.route('/add-publisher').get(authCheck, renderAddPublisher);

router.route('/view-publishers').get(authCheck, viewPublishers);

router.route('/add-newspaperSlots-details').get(authCheck, renderNewspaperSlots);

router.route('/view-requests').get(authCheck, viewRequest);

router.route('/view-request-details/:id').get(authCheck, viewPublisherDetails);

router.route('/add-publisher').post(authCheck, addPublisher);

router.route('/add-slots').get(authCheck, renderSaveAddSlots);

router.route('/initialize-slots').post(authCheck, saveAdSlots);

router.route('/delete-publisher/:id').post(authCheck, deletePublisher);

router.route('/delete-request/:id').post(authCheck, deleteRequest);

router.route("/logout").get(logoutAdmin);

module.exports = router;
