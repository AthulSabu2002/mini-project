const bcrypt = require('bcrypt');
const asyncHandler = require("express-async-handler");
const async = require('async');
const Request = require("../models/requestModel");
const Layout = require("../models/newsPaperLayout");
const Publisher = require("../models/publisherModel");
const BookingDates = require("../models/bookingDates");


const renderDashboard = asyncHandler(async (req, res) => {
    try {
        console.log(req.session.loggedIn);
        if(req.session.loggedIn){
            res.render('publisherDashboard', { activeTab: 'dashboard' });
        }
        else{
            console.log(req.user);
            res.redirect('/publisher/login');
        }
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).send('Error fetching requests');
    }
})


const renderSetBookings = asyncHandler(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.redirect('/publisher/login'); 
        }
    
        const user = await Publisher.findById(userId);
        if (!user) {
            return res.redirect('/publisher/login'); 
        } 
        
        const layoutDates = await BookingDates.find({ publisher: userId });
        
        res.render('setBookingDates', { layoutDates: layoutDates, activeTab: 'set-booking-date' });
    } catch (error) {
        console.error('Error fetching layout dates:', error);
        res.status(500).send('Error fetching layout dates');
    }
});


const setBookingDates = asyncHandler(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.redirect('/publisher/login'); 
        }
        
        const { layoutDate, bookingCloseDate } = req.body;
        
        if (!layoutDate || !bookingCloseDate) {
            return res.status(400).send('Layout date and booking close date are required');
        }
        
        const newBookingDate = new BookingDates({
            publisher: userId,
            bookingOpenDate: layoutDate,
            bookingCloseDate: bookingCloseDate
        });
        
        await newBookingDate.save();
        
        res.redirect('/publisher/set-booking-date');
    } catch (error) {
        console.error('Error setting booking dates:', error);
        res.status(500).send('Error setting booking dates');
    }
});



const viewLayout = asyncHandler(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.redirect('/publisher/login'); 
        }

        const user = await Publisher.findById(userId);
        if (!user) {
            return res.redirect('/publisher/login'); 
        }

        const email = user.email;
        const newspaperName = user.newspaperName;
        const layout = await Layout.findOne({ $or: [{ email }, { newspaperName }] });
        if (layout) {
            const layoutFileName = layout.layoutName;
            res.render(layoutFileName, { activeTab: 'view-layout' }); // Render layout file
        } else {
            res.status(404).send('Layout not found');
        }
    } catch (error) {
        console.error('Error fetching layout:', error);
        res.status(500).send('Error fetching layout');
    }
});


const loginPublisher = asyncHandler(async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
          return res.status(500).send("<script>alert('username and password fields are mandatory'); window.location='/auth/login';</script>");
        }
        const user = await Publisher.findOne({ username }, 'username email password');
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
                    return res.redirect('/publisher/dashboard');
                });
            } else {
                console.log('Incorrect password for user:', username);
                return res.status(500).send("<script>alert('Incorrect username or password'); window.location='/publisher/login';</script>");
            }
        } else {
            console.log('No user found with this username:', username);
            return res.status(500).send("<script>alert('Incorrect username or password'); window.location='/publisher/login';</script>");
        }
    } catch (error) {
        console.error('Error finding user:', error);
        return res.status(500).send("<script>alert('Internal Server error'); window.location='/publisher/login';</script>");
    }
});


const logoutPublisher = asyncHandler(async (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.loggedIn = false;
        req.session.destroy()
        res.clearCookie('userId');
        res.redirect('/publisher/login')
      });
})


const publisherRequest = asyncHandler(async (req, res) => {
    try {
        const { fullName, organizationName, newspaperName, username, password, confirmPassword, 
                mobileNumber, email, state, district, buildingName, pincode,
                advertisementSlots, fileFormat, paymentmethods, customerService,
                language,
                bookingDeadline, cancellationRefundPolicy, contentGuidelines,
                advertisementSubmissionGuidelines, cancellationDeadline } = req.body;

        const existingPublisher = await Request.findOne({ $or: [{ email }, { newspaperName }] });

        if (existingPublisher) {
            return res.status(400).send("<script>alert('Publisher with the same email or newspaper name already requested.'); window.location='/publisher/request';</script>");
        }

        if (password !== confirmPassword) {
            return res.status(400).send("<script>alert('Passwords do not match'); window.location='/publisher/request';</script>");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newRequest = new Request({
            fullName,
            organizationName,
            newspaperName,
            username,
            password: hashedPassword,
            mobileNumber,
            email,
            state,
            district,
            buildingName,
            pincode,
            advertisementSlots,
            fileFormat,
            paymentmethods,
            customerService,
            language,
            bookingDeadline,
            cancellationRefundPolicy,
            contentGuidelines,
            advertisementSubmissionGuidelines,
            cancellationDeadline
        });

        await newRequest.save();
        return res.status(200).json({ message: 'Requested successfully! Status will be updated via email provided' });

    } catch (error) {
        console.error('Error saving request:', error);
        res.status(500).json({ success: false, error: 'Error saving request' });
    }
});



module.exports = { loginPublisher,renderDashboard,renderSetBookings,setBookingDates, logoutPublisher, publisherRequest, viewLayout }