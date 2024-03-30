const bcrypt = require('bcrypt');
const asyncHandler = require("express-async-handler");
const async = require('async');
const Request = require("../models/requestModel");
const Layout = require("../models/newsPaperLayout");
const Publisher = require("../models/publisherModel");
const BookingDates = require("../models/bookingDates");


const renderDashboard = asyncHandler(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (userId) {
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
});


const renderPublisherAccountDetails = asyncHandler(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (userId) {
            try {
                const publisher = await Publisher.findById(userId);
                if (publisher) {
                    res.render('publisherAccountDetails', { publisher: publisher, activeTab: 'account-details' });
                } else {
                    res.status(404).send('User not found');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                res.status(500).send('Error fetching user');
            }
        }
        else{
            console.log(req.user);
            res.redirect('/publisher/login');
        }
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).send('Error fetching requests');
    }
});


const updatePublisherAccountDetails = asyncHandler(async (req, res) => {
    console.log('helloooo');
    const userId = req.cookies.userId;
    if (!userId) {
        return res.status(400).send('User ID cookie not found');
    }

    try {
        const user = await Publisher.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        user.fullName = req.body.fullName;
        user.organizationName = req.body.organizationName;
        user.newspaperName = req.body.newspaperName;
        user.mobileNumber = req.body.mobileNumber;
        user.email = req.body.email;
        user.state = req.body.state;
        user.district = req.body.district;
        user.buildingName = req.body.buildingName;
        user.pincode = req.body.pincode;
        user.advertisementSlots = req.body.advertisementSlots;
        user.fileFormat = req.body.fileFormat;
        user.paymentmethods = req.body.paymentmethods;
        user.customerService = req.body.customerService;
        user.language = req.body.language;
        user.bookingDeadline = req.body.bookingDeadline;
        user.cancellationRefundPolicy = req.body.cancellationRefundPolicy;
        user.contentGuidelines = req.body.contentGuidelines;
        user.advertisementSubmissionGuidelines = req.body.advertisementSubmissionGuidelines;
        user.cancellationDeadline = req.body.cancellationDeadline;

        await user.save();
        await user.save();
        res.status(200).send("<script>alert('Account details updated');</script>")
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).send('Error updating user details');
    }
});


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



const deleteDate = asyncHandler(async (req, res) => {
    const requestId = req.params.id;
    try {
        await BookingDates.findByIdAndDelete(requestId);
        return res.status(200).send("<script>alert('Booking Date Closed successfully.'); window.location='/publisher/set-booking-date';</script>");
    } catch (error) {
        console.error(error);
        return res.status(500).send("<script>alert('Err removing date'); window.location='/publisher/set-booking-date';</script>");
    }
});

module.exports = { loginPublisher, renderDashboard, renderSetBookings, setBookingDates, deleteDate, renderPublisherAccountDetails,updatePublisherAccountDetails, logoutPublisher, publisherRequest, viewLayout }