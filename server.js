const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const connectDb = require("./config/dbConnection");
const dotenv = require('dotenv').config();
const createError = require('http-errors');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const stripe = require('stripe');


const landingPageRouter = require('./routes/landingPageRouter')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usersRouter');
const adminRouter = require('./routes/adminRouter');
const publisherRouter = require('./routes/publisherRouter');
const authRouter = require('./routes/auth');
const checkoutRouter = require('./routes/checkoutRouter');
const webHookRouter = require('./routes/webHookRouter');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


app.set('trust proxy', 1) 

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
  })
);


app.use(passport.initialize());
app.use(passport.session());

connectDb();

app.use((req, res, next) => {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  next();
});

app.use('/', landingPageRouter);

app.use('/profile', indexRouter);

app.use('/users', usersRouter);

app.use('/admin', adminRouter);

app.use('/publisher', publisherRouter);

app.use('/auth', authRouter);

app.use('/stripe-checkout', checkoutRouter);

app.use('/webhook', webHookRouter);

// app.use('/forgot',require("./routes/usersRouter.js"));

// app.use('/resetPassword',require("./routes/usersRouter.js"));

// app.use('/reset/:token',require("./routes/usersRouter.js")); 

// app.use('/logout',require("./routes/usersRouter.js"));

// app.use('/dashboard',require("./routes/usersRouter.js"));

// app.use('/verifyOtp',require("./routes/usersRouter.js"));

// app.use('/registerUserWithOTP',require("./routes/usersRouter.js"));

let stripeGateway = stripe(process.env.stripe_api)


app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
