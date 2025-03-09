const asyncHandler = require("express-async-handler");
const Publisher = require("../models/publisherModel");
const Request = require("../models/requestModel");
const bcrypt = require('bcrypt')
const Layout = require("../models/newsPaperLayout");
const Newspaper = require("../models/newspaperSlots");
const Admin = require('../models/adminModel');


const loginAdmin = asyncHandler(async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log(req.body);
        
        if (!username || !password) {
          return res.status(500).send("<script>alert('username and password fields are mandatory'); window.location='/admin/login';</script>");
        }
        const user = await Admin.findOne({ username }, 'username email password');
  
        if (user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('Entered password hash:', hashedPassword);
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                req.login(user, (err) => {
                    if (err) {
                        console.error('Error logging in:', err);
                        return res.status(500).send("<script>alert('Internal Server error'); window.location='/admin/login';</script>");
                    }
                      req.session.loggedIn = true;
                      const userId = req.user.id;
                      res.cookie('userId', userId, { 
                          maxAge: 24 * 60 * 60 * 1000,
                          httpOnly: true 
                      });
                    const returnUrl = req.cookies.returnTo || '/admin/dashboard';
                    res.clearCookie('returnTo');
                    return res.redirect(returnUrl);
                });
            } else {
                console.log('Incorrect password for user:', username);
                return res.status(500).send("<script>alert('Incorrect username or password'); window.location='/admin/login';</script>");
            }
        } else {
            console.log('No user found with this username:', username);
            return res.status(500).send("<script>alert('Incorrect username or password'); window.location='/admin/login';</script>");
        }
    } catch (error) {
        console.error('Error finding user:', error);
        return res.status(500).send("<script>alert('Internal Server error'); window.location='/admin/login';</script>");
    }
});

const logoutAdmin = asyncHandler(async (req, res) => {
    req.logOut(function(err) {
      if (err) { return next(err); }
        req.session.loggedIn = false;
        req.session.destroy()
        res.clearCookie('userId');
      res.redirect('/admin/login'); 
    });
});


const renderAddPublisher = asyncHandler(async (req, res) => {
    try {
        const defaultPublisher = {
            fullName: 'John Doe',
            organizationName: 'Example Corp',
            newspaperName: 'Example Times',
            username: 'example_user',
            password: '', // Set default password
            confirmPassword: '', // Set default confirm password
            mobileNumber: '1234567890',
            email: 'example@example.com',
            state: 'Example State',
            district: 'Example District',
            buildingName: 'Example Building',
            pincode: '123456',
            advertisementSlots: 'Display Ads, Classified Ads',
            fileFormat: 'PDF, JPEG',
            paymentmethods: 'Credit Card, Bank Transfer',
            customerService: '9876543210',
            language: 'English',
            bookingDeadline: '2 days before',
            cancellationRefundPolicy: 'No refunds',
            contentGuidelines: 'No specific guidelines',
            advertisementSubmissionGuidelines: 'No specific guidelines',
            cancellationDeadline: '1 day before'
        };
        res.render('addPublisher', { publisher: defaultPublisher, activeTab: 'add-publisher' })
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).send('Error fetching requests');
    }
})


const renderDashboard = asyncHandler(async (req, res) => {
    try {
        const publisherCount = await Publisher.countDocuments();
        const requestCount = await Request.countDocuments();
        const requests = await Request.find();

        const total_revenue = publisherCount * 10000;

        res.render('adminDashboard', { requests: requests, requestCount: requestCount, publisherCount: publisherCount,total_revenue: total_revenue,  activeTab: 'dashboard' });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).send('Error fetching requests');
    }
})


const viewPublishers = asyncHandler(async (req, res) => {
    try {
        const publishers = await Publisher.find({});
        
        res.render('viewPublishers', { publishers, activeTab: 'view-publishers' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching publishers." });
    }
});


const viewRequest = async(req, res) => {
    try {
        const requests = await Request.find();
        res.render('view-publisher-requests', { requests: requests, activeTab: 'view-requests' });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).send('Error fetching requests');
    }
}


const viewPublisherDetails = async (req, res) => {
    try {
        const requestId = req.params.id;
        const publisher = await Request.findById(requestId);

        if (!publisher) {
            return res.status(404).send('Publisher not found');
        }

        res.render('addPublisher', { publisher: publisher, activeTab: 'add-publisher' });

    } catch (error) {
        console.error('Error fetching publisher details:', error);
        res.status(500).send('Internal server error');
    }
};



const renderNewspaperSlots = asyncHandler(async (req, res) => {
    try {
        res.render('newspaperSlots', { activeTab: 'add-publisher' })
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).send('Error fetching requests');
    }
})


const renderSaveAddSlots = asyncHandler(async (req, res) => {
    try {
        res.render('adminAddSlots', { activeTab: 'add-slots' })
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).send('Error fetching requests');
    }
})

const saveAdSlots = asyncHandler(async (req, res) => {
    try {
        const { newspaperName, slotNames } = req.body;

        let newspaper = await Newspaper.findOne({ newspaperName });

        if (!newspaper) {
            newspaper = new Newspaper({
                newspaperName,
                slots: []
            });
        }

        if (slotNames && Array.isArray(slotNames)) {
            slotNames.forEach(slotName => {
                newspaper.slots.push({ slotName });
            });
        }

        await newspaper.save();

        res.status(201).json({ message: 'Slots initialized successfully' });
    } catch (error) {
        console.error('Error initializing slots:', error);
        res.status(500).json({ error: 'Failed to initialize slots' });
    }
})


const addPublisher = asyncHandler(async (req, res) => {
    try {
        const { username, email, newspaperName } = req.body;

        const requestData = await Request.findOne({ email, newspaperName });

        if (!requestData) {
            return res.status(404).json({ error: 'Request not found.' });
        }

        const { fullName, organizationName, password, confirmPassword,
            mobileNumber, state, district, buildingName, pincode,
            advertisementSlots, fileFormat, paymentmethods, customerService,
            language, bookingDeadline, cancellationRefundPolicy,
            contentGuidelines, advertisementSubmissionGuidelines,
            cancellationDeadline, layout } = requestData;

        const existingPublisher = await Publisher.findOne({ $or: [{ email }, { newspaperName }] });

        if (existingPublisher) {
            return res.status(400).json({ error: 'Publisher with the same email or newspaper name already exists.' });
        }

        const newPublisher = new Publisher({
            fullName,
            organizationName,
            newspaperName,
            username,
            password,
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
            cancellationDeadline,
            layout 
        });

        await newPublisher.save();
        await Request.deleteOne({ email, newspaperName });

        return res.status(200).json({ message: 'Publisher added successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error adding publisher.' });
    }
});



const deleteRequest = asyncHandler(async (req, res) => {
    const requestId = req.params.id;
    try {
        await Request.findByIdAndDelete(requestId);
        return res.status(200).send("<script>alert('Request deleted successfully.'); window.location='/admin/view-requests';</script>");
    } catch (error) {
        console.error(error);
        return res.status(500).send("<script>alert('Err removing publisher'); window.location='/admin/view-requests';</script>");
    }
});


const deletePublisher = asyncHandler(async (req, res) => {
    const publisherId = req.params.id;
    try {
        await Publisher.findByIdAndDelete(publisherId);
        return res.status(200).send("<script>alert('Publisher deleted successfully.'); window.location='/admin/view-publishers';</script>");
    } catch (error) {
        console.error(error);
        return res.status(500).send("<script>alert('Err removing publisher'); window.location='/admin/view-publishers';</script>");
    }
});




 module.exports = { 
                    loginAdmin,
                    addPublisher,  
                    viewPublishers, 
                    deletePublisher, 
                    viewRequest,
                    viewPublisherDetails, 
                    renderDashboard, 
                    renderAddPublisher,
                    renderNewspaperSlots, 
                    deleteRequest,
                    renderSaveAddSlots,
                    saveAdSlots,
                    logoutAdmin
                }