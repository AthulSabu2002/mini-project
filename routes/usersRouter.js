const express = require("express");
const {
      loginUser, 
      resetPassword, 
      changePasswordRequest, 
      changePassword, 
      logoutUser, 
      renderDashboard,  
      verifyOtp,
      registerUserWithOTP } = require("../controllers/userController");


const router = express.Router();
const bodyParser = require("body-parser");


const path = require("path");

const app = express();

const urlencodedParser = bodyParser.urlencoded({ extended: true })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static("public"));

// router.route("/").get((req,res) => {
//   try{
//     res.send('hi')
//   }
//   catch(err){
//     res.send(err);
//     }
// });

router.route("/login").get((req,res) => {
    try{
      res.render('login.ejs')
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
    res.render('verify-otp', { email: userEmail });
});

router.route("/logout").post(logoutUser);

router.route("/reset/:token").get(urlencodedParser,changePasswordRequest);

router.route("/login").post(urlencodedParser,loginUser);

router.route("/dashboard").get(renderDashboard);

router.route("/forgot").post(urlencodedParser,resetPassword);

router.route("/verifyOtp").post(urlencodedParser,verifyOtp);

router.route("/registerUserWithOTP").post(urlencodedParser,registerUserWithOTP)

router.route("/reset/:token").post(urlencodedParser,changePassword);



module.exports = router;