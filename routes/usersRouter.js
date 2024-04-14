const express = require("express");
const {
      loginUser, 
      resetPassword, 
      changePasswordRequest, 
      changePassword, 
      logoutUser, 
      renderDashboard,  
      verifyOtp,
      registerUserWithOTP,
      renderBookSlot,
      renderBookSlotByDate,
      renderBookinglayout,
      bookSlot,
      renderSuccessPage,
      renderCancelPage
     } = require("../controllers/userController");


const router = express.Router();
const bodyParser = require("body-parser");


const path = require("path");

const app = express();

const urlencodedParser = bodyParser.urlencoded({ extended: true })

const multer = require('multer');
const storage = multer.memoryStorage();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static("public"));

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Limit file size to 10 MB
    },
}).single('file');

const authCheck = (req, res, next) => {
  if(!req.user){
    res.redirect('/auth/login')
  }
  else{
    next()
  }
}

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

router.route("/viewSlot/:layoutName/:publishingDate").get(authCheck, renderBookinglayout);

router.route('/book-slot').post(upload, bookSlot);

router.route('/book-slot/success').get(renderSuccessPage);

router.route('/book-slot/cancel').get(renderCancelPage);

router.route("/viewSlot").get(authCheck, renderBookSlot);

router.route("/viewSlot").post(renderBookSlotByDate);

router.route("/logout").post(logoutUser);

router.route("/reset/:token").get(urlencodedParser,changePasswordRequest);

router.route("/login").post(urlencodedParser,loginUser);

router.route("/dashboard").get(renderDashboard);

router.route("/forgot").post(urlencodedParser,resetPassword);

router.route("/verifyOtp").post(urlencodedParser,verifyOtp);

router.route("/registerUserWithOTP").post(urlencodedParser,registerUserWithOTP)

router.route("/reset/:token").post(urlencodedParser,changePassword);



module.exports = router;