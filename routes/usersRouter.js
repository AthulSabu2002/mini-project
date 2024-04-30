const express = require("express");
const asyncHandler = require("express-async-handler");
const async = require('async');
const Users = require('../models/userModel');
const {
      loginUser, 
      resetPassword, 
      changePasswordRequest, 
      changePassword, 
      logoutUser, 
      renderDashboard,
      renderUserProfile,
      updateUserProfile,
      renderViewBookingsPage,  
      verifyOtp,
      registerUserWithOTP,
      renderNewspaperInfo,
      renderBookSlotByDate,
      renderBookinglayout,
      bookSlot,
      renderSuccessPage,
      renderCancelPage,
      cancelBooking,
      renderCancelConfirmationPage
     } = require("../controllers/userController");


const router = express.Router();
const bodyParser = require("body-parser");


const path = require("path");

const app = express();

const urlencodedParser = bodyParser.urlencoded({ extended: true });


const multer = require('multer');
const storage = multer.memoryStorage();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static("public"));

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
}).single('file');

// const authCheck = (req, res, next) => {
//   if(!req.user){
//     res.cookie('returnTo', req.originalUrl || 'unknown');
//     res.redirect('/auth/login')
//   }
//   else{
//     next()
//   }
// }

const authCheck = asyncHandler(async (req, res, next) => {
  const userId = req.cookies.userId;
  if (!userId) {
      return res.redirect('/auth/login'); 
  }

  const user = await Users.findById(userId);
  if (!user) {
      return res.redirect('/auth/login'); 
  } 
  else{
    next()
  }
});

router.route("/login").get((req,res) => {
    try{
      res.render("login");
    }
    catch(err){
      res.send(err);
      }
  });


router.route("/registerUserWithOTP").get((req,res) => {
  try{
    res.render('register.ejs')
  }
  catch(err){
    res.send(err);
    }
});


router.route("/forgot").get((req, res) => {
  try{
    res.render('forgot');
  }
  catch(err){
    res.send(err);
  }
})

router.route("/resetPassword").get((req, res) => {
  try{
    res.render('resetPassword');
  }
  catch(err){
    res.send(err);
  }
})

router.route("/verifyOtp").get((req, res) =>{
    const userEmail = req.query.email;
    res.render('user/verify-otp', { email: userEmail });
});

router.route("/login").post(urlencodedParser,loginUser);

router.route("/forgot").post(urlencodedParser,resetPassword);

router.route("/verifyOtp").post(urlencodedParser,verifyOtp);

router.route("/registerUserWithOTP").post(urlencodedParser,registerUserWithOTP)

router.route("/reset/:token").post(urlencodedParser,changePassword);

router.route("/reset/:token").get(urlencodedParser,changePasswordRequest);

router.route("/dashboard").get(authCheck, renderDashboard);

router.route("/dashboard/view-profile").get(authCheck, renderUserProfile);

router.route("/dashboard/profile/update-profile").post(urlencodedParser, authCheck, updateUserProfile);

router.route("/dashboard/view-bookings").get(authCheck, renderViewBookingsPage);

router.route("/viewSlot/:layoutName").get(authCheck, renderNewspaperInfo);

router.route("/viewSlot/:layoutName").post(authCheck, renderBookSlotByDate);

router.route("/viewSlot/:layoutName/:publishingDate").get(authCheck, renderBookinglayout);

router.route('/stripe-checkout').post(authCheck, upload, bookSlot);

router.route('/book-slot/success').get(authCheck, renderSuccessPage);

router.route('/cancel-slot/:bookingId').get(authCheck, renderCancelConfirmationPage);

router.route('/cancel-slot/:bookingId').post(authCheck, cancelBooking);

router.route('/book-slot/cancel').get(authCheck, renderCancelPage);

router.route("/logout").get(logoutUser);




module.exports = router;
