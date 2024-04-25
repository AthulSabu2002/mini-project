const asyncHandler = require("express-async-handler");
const async = require('async');
const User = require("../models/userModel");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const stripe = require('stripe');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


const Publisher = require('../models/publisherModel');
const Layout = require('../models/layout');
const BookingDates = require('../models/bookingDates');
const BookedSlots = require("../models/bookedSlots");
const TemporaryBooking = require('../models/temporaryBooking');
const SlotPrices = require('../models/slotPrices');

app.set('io', io);


const renderDashboard = asyncHandler(async (req, res) => {
   if(req.session.loggedIn){
    res.render('userDashboard');
   }
    else{
      res.redirect('/auth/login');
    }
});


const logoutUser = asyncHandler(async (req, res) => {
  req.logOut(function(err) {
    if (err) { return next(err); }
      req.session.loggedIn = false;
      req.session.destroy()
      res.clearCookie('userId');
    res.redirect('/auth/login'); 
  });
});


const tempUserData = {};


const registerUserWithOTP = asyncHandler(async (req, res) => {
  const otp = generateOTP();

  tempUserData[req.body.email] = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    otp: otp,
  };

  try {
    await sendOTPEmail(req.body.email, otp);
    res.render('otpReg.ejs', { email: req.body.email });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Registration failed' });
  }
});


const verifyOtp = asyncHandler(async (req, res) => {
  const userEmail = req.body.email;
  const enteredOTP = req.body.otp;

  try {
        const tempUser = tempUserData[userEmail];
        if (tempUser) {
            if (enteredOTP === tempUser.otp) {
              const hashedPassword = await bcrypt.hash(tempUser.password, 10);

              const newUser = new User({
                username: tempUser.username,
                email: tempUser.email,
                password: hashedPassword
              });

              await newUser.save();

              delete tempUserData[userEmail];

              req.login(newUser, (err) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send("Internal Server Error");
                }

                return res.redirect('/profile/');
              });
            } else {
                res.status(400).json({ message: 'Invalid OTP. Please try again.' });
              }

        } else {
            res.status(400).json({ message: 'Username is already taken. Please choose another.' });
          }
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});


function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


async function sendOTPEmail(email, otp) {
  console.log(`Sending OTP ${otp} to ${email}`);
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: process.env.MYEMAIL,
      pass: process.env.APP_PASSWORD, 
    }
  });

  const mailOptions = {
    from: process.env.MYEMAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};


const loginUser = asyncHandler(async (req, res) => {
  try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(500).send("<script>alert('username and password fields are mandatory'); window.location='/auth/login';</script>");
      }
      const user = await User.findOne({ username }, 'username email password');

      if (user) {
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) {
              req.login(user, (err) => {
                  if (err) {
                      console.error('Error logging in:', err);
                      return res.status(500).send("<script>alert('Internal Server error'); window.location='/auth/login';</script>");
                  }
                    req.session.loggedIn = true;
                    const userId = req.user.id;
                    res.cookie('userId', userId, { 
                        maxAge: 24 * 60 * 60 * 1000,
                        httpOnly: true 
                    });
                  const returnUrl = req.cookies.returnTo || '/profile';
                  res.clearCookie('returnTo');
                  return res.redirect(returnUrl);
              });
          } else {
              console.log('Incorrect password for user:', username);
              return res.status(500).send("<script>alert('Incorrect username or password'); window.location='/auth/login';</script>");
          }
      } else {
          console.log('No user found with this username:', username);
          return res.status(500).send("<script>alert('Incorrect username or password'); window.location='/auth/login';</script>");
      }
  } catch (error) {
      console.error('Error finding user:', error);
      return res.status(500).send("<script>alert('Internal Server error'); window.location='/auth/login';</script>");
  }
});




const resetPassword = asyncHandler(async (req, res, next) => {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
              if (err) {
                return done(err);
              }
              var token = buf.toString('hex');
              done(null, token);
              console.log(token);
            });
      },
      async function findUserAndUpdateToken(token) {
          const user = await User.findOne({ email: req.body.email });
          if (!user) {
            console.log('error', 'No account with that email address exists.');
            return res.redirect('/users/forgot');
          }
          user.resetPasswordToken = token;
          console.log(user.resetPasswordToken);
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          console.log(user);
          console.log(user.email);
          try {
            console.log("saving..")
            await user.save();
            console.log('User saved successfully.');
            return user;
          } catch (error) {
            console.error('Error while saving user:', error);
          }
          callback(null, user);   
      },
      function(user, callback) {
        var smtpTrans = nodemailer.createTransport({
           service: 'Gmail', 
           auth: {
            user: process.env.MYEMAIL,
            pass: process.env.APP_PASSWORD,
          }
        });
        
          smtpTrans.sendMail({
            to: user.email,
            from: process.env.MYEMAIL,
            subject: 'aDColumn password reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/users/reset/' + user.resetPasswordToken + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          });
          console.log("Mail sent successfully");
          res.send("check your mail id for the password reset link");
  }
    ], function(err) {
      console.log('this err' + ' ' + err)
      res.redirect('/');
    });
  });

const changePasswordRequest = asyncHandler(async (req, res) => {
  console.log('resetting')
  const requestToken = req.params.token;
  const user = await User.findOne({ resetPasswordToken: requestToken, resetPasswordExpires: { $gt: Date.now() }});
  console.log(user);
  if (user) {
    res.render('resetPassword.ejs',{ requestToken });
  } else {
    res.status(400).send('Invalid or expired token');
  }
});

const changePassword = asyncHandler(async (req, res) => {
  async.waterfall([
    async function(callback) {
      const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
      if (!user) {
        return res.status(400).send('Password reset token is invalid or has expired.');
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      user.password = hashedPassword;

      try {
        console.log("saving..")
        await user.save();
        console.log('User saved successfully.');
        return user;
      } catch (error) {
        console.error('Error while saving user:', error);
      }
      
      console.log(user);
      callback(null, user);
    },
    function(user, callback) {
      console.log(user);
      var smtpTrans = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.MYEMAIL,
          pass: process.env.APP_PASSWORD,
        }
      });

      var mailOptions = {
        to: user.email,
        from: process.env.MYEMAIL,
        subject: 'aDColumn',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };

      smtpTrans.sendMail(mailOptions, function(err) {
        if (err) {
          console.log('Email sending error:', err);
        } else {
          console.log('Success! Your password has been changed.');
          res.send('Password changed.Please return to login page for login');
        }
      });
    }
  ], function(err) {
    if (err) {
      console.log(err);
      return res.status(500).send('An error occurred during the password change process.');
    }
  });
});


const renderBookSlot = asyncHandler( async(req, res) => {
  try{
    res.render('defaultLayout');
  }catch(error){
    console.log(error);
  }
});


const renderBookSlotByDate = asyncHandler(async (req, res) => {
  try {
    const { day, date, month } = req.body;
    const monthNumber = getMonthNumber(month);

    const publishingDate = new Date(Date.UTC(new Date().getFullYear(), monthNumber, date));

    res.cookie('publishingDate', publishingDate.toISOString(), { maxAge: 365 * 24 * 60 * 60 * 1000 });

    const requestedDate = new Date();

    const booking = await BookingDates.findOne({
        bookingOpenDate: { $lte: requestedDate },
        bookingCloseDate: { $gte: requestedDate },
        publishingDate: publishingDate
    });


      if (booking) {
          const publisherId = booking.publisher;
          const publisherLayout = await Publisher.findOne({ _id: publisherId });
          if (publisherLayout) {
              const layoutName = publisherLayout.newspaperName;

              const bookedSlots = await BookedSlots.find({
                newspaperName: layoutName,
                publishingDate: publishingDate
              });

              const bookedSlotIds = bookedSlots.map(slot => slot.slotId);
              
              res.status(200).json({ layoutName, bookedSlotIds, publishingDate }); 
            } else {
                const layoutName = 'defaultLayout';
                res.status(200).json({ layoutName, publishingDate }); 
            }
        } else {
            const layoutName = 'defaultLayout';
            res.status(200).json({ layoutName, publishingDate }); 
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const renderBookinglayout = asyncHandler(async (req, res) => {
  try {
      const layoutName = req.params.layoutName;
      const publishingDateOldFormat = req.params.publishingDate;

      const year = publishingDateOldFormat.slice(0, 4);
      const month = publishingDateOldFormat.slice(4, 6);
      const day = publishingDateOldFormat.slice(6, 8);
      const publishingDateISO8601 = `${year}-${month}-${day}T00:00:00.000Z`;

      const bookedSlots = await BookedSlots.find({
        newspaperName: layoutName,
        publishingDate: publishingDateISO8601
      });

      const bookedSlotIds = bookedSlots.map(slot => slot.slotId);

      res.render(layoutName, { publishingDate: publishingDateOldFormat, bookedSlotIds: bookedSlotIds });
    } catch (err) {
      res.send(err);
  }
});

const renderSuccessPage = asyncHandler( async(req, res) => {
  try{

    const sessionId = req.cookies.sessionId;
    console.log(sessionId);
    res.clearCookie('sessionId');

    const temporaryBooking = await TemporaryBooking.findOne({ sessionId: sessionId });
    console.log(temporaryBooking);

    if (!temporaryBooking) {
      return res.status(404).send('Temporary booking not found');
    }

    const booking = new BookedSlots({
      userId: temporaryBooking.tempUserId,
      slotId: temporaryBooking.slotId,
      newspaperName: temporaryBooking.newspaperName,
      publishingDate: temporaryBooking.publishingDate,
      file: temporaryBooking.file,
      price: temporaryBooking.price,
      sessionId: temporaryBooking.sessionId
    });

    await booking.save();

    await TemporaryBooking.deleteOne({ sessionId: sessionId });

    req.app.io.emit('slotBooked', booking.slotId);
    console.log('slotBooked event emitted with slotId:', booking.slotId);

    res.render('bookingSuccess');
  }catch(error){
    console.log(error);
  }
}); 


const renderCancelPage = asyncHandler( async(req, res) => {
  try{
    const sessionId = req.cookies.sessionId;
    res.clearCookie('sessionId');

    await TemporaryBooking.deleteOne({ sessionId: sessionId });

    res.send('failure');
  }catch(error){
    console.log(error);
  }
}); 



let stripeGateway = stripe(process.env.stripe_api)
let DOMAIN = process.env.USER_DOMAIN


//stripe-checkout
const bookSlot = asyncHandler(async (req, res) => {
  try {
    const userId = req.cookies.userId;
    const file = req.file;
    const { slotId, newspaperName } = req.body;
    const publishingDate = req.cookies.publishingDate;
    // const publishingDate = new Date(publishingDateStr);

    // Check if the slotId is already booked
    const bookedSlots = await BookedSlots.find({
      newspaperName: newspaperName,
      publishingDate: publishingDate,
      slotId: slotId,
    });

    if (bookedSlots.length > 0) {
      return res.redirect('/slot-booked');
    }

    const price = await findSlotPrice(newspaperName, slotId);

    const lineItems = [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: newspaperName,
            description: `Slot ${slotId} - ${newspaperName} (${publishingDate})`,
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripeGateway.checkout.sessions.create({
      currency: 'inr',
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${DOMAIN}/book-slot/success`,
      cancel_url: `${DOMAIN}/book-slot/cancel`,
      line_items: lineItems,
      billing_address_collection: 'required',
    });

    const sessionId = session.id;
    res.cookie('sessionId', sessionId, { httpOnly: true });

    const bookingBeforePayment = new TemporaryBooking({
      tempUserId: userId,
      slotId: slotId,
      newspaperName: newspaperName,
      publishingDate: publishingDate,
      file: { data: file.buffer, contentType: file.mimetype },
      price: price,
      sessionId: session.id,
    });

    await bookingBeforePayment.save();

    res.status(201).json(session.url);
  } catch (error) {
    console.error('Error booking slot:', error);
    res.status(500).json({ success: false, error: 'Failed to book slot. Please try again.' });
  }
});


const webHook =  asyncHandler(async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      const userId = checkoutSessionCompleted.client_reference_id;
      
      const user = await getUserDetails(userId);
      
      if (user) {
        console.log('User Details:', user);
      } else {
        console.error('User not found');
      }

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.send();
});

async function getUserDetails(userId) {
  try {
    const user = await User.findOne({ _id: userId });
    console.log(user);
    return user;
  } catch (error) {
    console.error('Error retrieving user details:', error);
    return null; 
  }
}



function getMonthNumber(monthAbbreviation) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.indexOf(monthAbbreviation);
}

async function findSlotPrice(newspaperName, slotName) {
  try {
      const slotPrices = await SlotPrices.findOne({ newspaperName: newspaperName });

      if (!slotPrices) {
          return null;
      }

      const slot = slotPrices.slots.find(slot => slot.name === slotName);

      if (!slot) {
          return null;
      }

      return slot.price;
  } catch (error) {
      console.error('Error finding slot price:', error);
      throw error;
  }
}





module.exports = {
                  loginUser,  
                  resetPassword, 
                  changePasswordRequest, 
                  changePassword, 
                  logoutUser, 
                  renderDashboard ,
                  registerUserWithOTP,
                  verifyOtp,
                  renderBookSlot,
                  renderBookSlotByDate,
                  renderBookinglayout,
                  bookSlot,
                  renderSuccessPage,
                  renderCancelPage,
                  webHook
                };
