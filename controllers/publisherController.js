const bcrypt = require('bcrypt');
const asyncHandler = require("express-async-handler");
const async = require('async');
const stripe = require('stripe');
const mongoose = require('mongoose');

const Request = require("../models/requestModel");
const Layout = require("../models/newsPaperLayout");
const Publisher = require("../models/publisherModel");
const BookingDates = require('../models/bookingDates');
const BookedSlots = require("../models/bookedSlots");
const SlotPrices = require("../models/slotPrices");
const Newspapers = require("../models/newspaperSlots");
const TemporaryRequest = require('../models/temporaryPublisherRequest');
const CancelledBookings = require('../models/cancelledBookingModel');
const TemporaryRefund = require('../models/temporaryRefundsModel');
const Refunded = require('../models/refundedItemsModel');
const User = require('../models/userModel');

let stripeGateway = stripe(process.env.stripe_api)
let PUBLISHER_DOMAIN = process.env.PUBLISHER_DOMAIN



const renderDashboard = asyncHandler(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (userId) {
            const publisher = await Publisher.findById(userId);
            if (publisher) {
                const newspaperName = publisher.newspaperName;

                const bookingsCount = await BookedSlots.countDocuments({ newspaperName });

                const currentDate = new Date();
                currentDate.setUTCHours(0, 0, 0, 0);

                const bookings = await BookedSlots.find({
                    newspaperName,
                    $expr: {
                        $eq: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            { $dateToString: { format: "%Y-%m-%d", date: currentDate } }
                        ]
                    }
                });

                const cancelledBookings = await CancelledBookings.find({
                    newspaperName,
                    $expr: {
                        $eq: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            { $dateToString: { format: "%Y-%m-%d", date: currentDate } }
                        ]
                    }
                });


                const result = await BookedSlots.aggregate([
                    {
                        $match: {
                            newspaperName: newspaperName
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalPrice: { $sum: "$price" }
                        }
                    }
                ]);

                const totalPrice = result.length > 0 ? result[0].totalPrice : 0;


                const distinctUsersCount = await BookedSlots.aggregate([
                    {
                        $match: { newspaperName: newspaperName }
                    },
                    {
                        $group: {
                            _id: "$userId"
                        }
                    },
                    {
                        $count: "count"
                    }
                ]);

                const count = distinctUsersCount.length > 0 ? distinctUsersCount[0].count : 0;

                const formattedBookings = bookings.map(booking => {
                    const createdAt = new Date(booking.createdAt).toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-');
                    const publishingDate = new Date(booking.publishingDate).toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/\//g, '-');
                    return {
                        createdAt: createdAt,
                        publishingDate: publishingDate,
                        slotId: booking.slotId,
                        newspaperName: newspaperName
                    };
                });

                const formattedCancellations = cancelledBookings.map(cancelledBooking => {
                    const createdAt = new Date(cancelledBooking.createdAt)
                        .toLocaleString(undefined, {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        })
                        .replace(/(\d+)\/(\d+)\/(\d+)/, '$1-$2-$3');
                    const publishingDate = new Date(cancelledBooking.publishingDate).toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/\//g, '-');
                    return {
                        createdAt: createdAt,
                        publishingDate: publishingDate,
                        slotId: cancelledBooking.slotId,
                        newspaperName: newspaperName,
                        file: cancelledBooking.file,
                        cancellationId: cancelledBooking._id
                    };
                });


                res.render('publisherDashboard', { activeTab: 'dashboard', bookingsCount: bookingsCount, bookings: formattedBookings, cancelledBookings: formattedCancellations, count: count, totalPrice: totalPrice });
            }
            else {
                res.redirect('/publisher/login');
            }

        }
        else {
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
        else {
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

        const user = await Publisher.findById(userId);
        if (!user) {
            return res.redirect('/publisher/login');
        }

        const { publishingDate, layoutDate, bookingCloseDate } = req.body;

        if (!layoutDate || !bookingCloseDate) {
            return res.status(400).send('Layout date and booking close date are required');
        }

        const newBookingDate = new BookingDates({
            publisher: userId,
            publishingDate: publishingDate,
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


const renderSlotsPricing = asyncHandler(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.redirect('/publisher/login');
        }

        const user = await Publisher.findById(userId);
        if (!user) {
            return res.redirect('/publisher/login');
        }

        const newspaperName = user.newspaperName;
        console.log(newspaperName);

        const newspaper = await Newspapers.find({ newspaperName: newspaperName });

        const data = newspaper.map(newspaper => ({
            newspaperName: newspaperName,
            slotNames: newspaper.slots.map(slot => slot.slotName)
        }));


        res.render('publisherAddPrice', { activeTab: 'pricing', data: data });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error');
    }
})


const SaveSlotsPricing = asyncHandler(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.redirect('/publisher/login');
        }

        const user = await Publisher.findById(userId);
        if (!user) {
            return res.redirect('/publisher/login');
        }

        const newspaperName = user.newspaperName;
        const slotPrice = req.body.slotPrices;

        let existingSlotPrices = await SlotPrices.findOne({ newspaperName });

        if (existingSlotPrices) {
            existingSlotPrices.slots = slotPrice.map((price, index) => ({
                name: `slot${index + 1}`,
                price: parseInt(price)
            }));
            await existingSlotPrices.save();
        } else {
            const newSlotPrices = new SlotPrices({
                newspaperName: newspaperName,
                slots: slotPrice.map((price, index) => ({
                    name: `slot${index + 1}`,
                    price: parseInt(price)
                }))
            });
            await newSlotPrices.save();
        }

        res.status(200).json({ message: 'price updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error saving prices document');
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
            res.render(layoutFileName, { activeTab: 'view-layout' });
        } else {
            res.status(404).send('Layout not found');
        }
    } catch (error) {
        console.error('Error fetching layout:', error);
        res.status(500).send('Error fetching layout');
    }
});


const renderBookedLayout = asyncHandler(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.redirect('/publisher/login');
        }

        const user = await Publisher.findById(userId);
        if (!user) {
            return res.redirect('/publisher/login');
        }

        const newspaperName = req.params.newspaperName;
        const publishingDateOldFormat = req.params.publishingDate;

        const [month, day, year] = publishingDateOldFormat.split('-');

        const paddedDay = day.length < 2 ? day.padStart(2, '0') : day;
        const paddedMonth = month.length < 2 ? month.padStart(2, '0') : month;

        const publishingDateISO8601 = `${year}-${paddedMonth}-${paddedDay}T00:00:00.000Z`;

        const bookedSlots = await BookedSlots.find({
            newspaperName: newspaperName,
            publishingDate: publishingDateISO8601
        });

        const bookedSlotIds = bookedSlots.map(slot => slot.slotId);
        const adIds = bookedSlots.map(slot => slot.adId);

        const adDetailsPromises = adIds.map(adId => BookedSlots.findById(adId));
        const adDetails = await Promise.all(adDetailsPromises);

        const slotAdDetails = {};
        bookedSlots.forEach((slot, index) => {
            slotAdDetails[slot.slotId] = {
                adId: slot.adId,
                adDetails: adDetails[index]
            };
        });

        const bookedLayout = `${newspaperName}-booked`;
        res.render(bookedLayout, {
            publishingDate: publishingDateOldFormat,
            bookedSlotDetails: slotAdDetails,
            bookedSlotIds: bookedSlotIds
        });

    } catch (error) {
        console.error('Error fetching layout:', error);
        res.status(500).send('Error fetching layout');
    }
});


const sendBookedDetails = asyncHandler(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.redirect('/publisher/login');
        }

        const user = await Publisher.findById(userId);
        if (!user) {
            return res.redirect('/publisher/login');
        }

        const newspaperName = req.params.newspaperName;
        const publishingDateOldFormat = req.params.publishingDate;

        const [month, day, year] = publishingDateOldFormat.split('-');

        const paddedDay = day.length < 2 ? day.padStart(2, '0') : day;
        const paddedMonth = month.length < 2 ? month.padStart(2, '0') : month;

        const publishingDateISO8601 = `${year}-${paddedMonth}-${paddedDay}T00:00:00.000Z`;


        const bookedSlots = await BookedSlots.find({
            newspaperName: newspaperName,
            publishingDate: publishingDateISO8601
        });

        res.json(bookedSlots);
    } catch (error) {

        console.error('Error fetching booked slot details:', error);
        res.status(500).json({ error: 'Error fetching booked slot details' });
    }
});






const renderViewBookings = asyncHandler(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.redirect('/publisher/login');
        }

        const user = await Publisher.findById(userId);
        if (!user) {
            return res.redirect('/publisher/login');
        }

        const newspaperName = user.newspaperName;

        const bookings = await BookedSlots.find({ newspaperName });

        const formattedBookings = bookings.map(booking => {
            const createdAt = new Date(booking.createdAt)
                .toLocaleString(undefined, {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
                .replace(/(\d+)\/(\d+)\/(\d+)/, '$2-$1-$3');
            const publishingDate = new Date(booking.publishingDate).toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/\//g, '-');
            return {
                createdAt: createdAt,
                publishingDate: publishingDate,
                slotId: booking.slotId,
                newspaperName: newspaperName,
                file: booking.file,
                id: booking._id
            };
        });

        res.render('publisherViewBookings', { bookings: formattedBookings, activeTab: 'view-bookings' });


    } catch (error) {
        console.error('Error fetching layout:', error);
        res.status(500).send('Error fetching layout');
    }
});


const renderRejectBooking = asyncHandler(async (req, res) => {
    try {
        const userId = req.cookies.userId;

        if (!userId) {
            return res.redirect('/publisher/login');
        }

        const user = await Publisher.findById(userId);
        if (!user) {
            return res.redirect('/publisher/login');
        }

        const newspaperName = user.newspaperName;

        var booking_id = req.params.booking_id;
        console.log(booking_id);

        if (!booking_id) {
            return res.redirect('/publisher/login');
        }

        booking_id = new mongoose.Types.ObjectId(booking_id);

        const booking = await BookedSlots.findById(booking_id);

        const booked_userId = booking.userId;

        const booked_user = await User.findById(booked_userId);

        const user_email = booked_user.email;

        console.log(booked_user);

        res.render('publisher-ad-rejection', { user_email: user_email, booking_id: booking_id, newspaperName: newspaperName });
    }
    catch (error) {
        console.error('Error fetching layout:', error);
        res.status(500).send('Error fetching layout');
    }
});

const rejectBooking = asyncHandler(async (req, res) => {
    try {
        const userId = req.cookies.userId;

        if (!userId) {
            return res.redirect('/publisher/login');
        }

        const user = await Publisher.findById(userId);
        if (!user) {
            return res.redirect('/publisher/login');
        }

        const newspaperName = user.newspaperName;
        const { email, subject, description, bookingId } = req.body;

        console.log(req.body);


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MYEMAIL,
                pass: process.env.APP_PASSWORD,
            }
        });

        const mailOptions = {
            from: process.env.MYEMAIL,
            to: email,
            subject: subject,
            text: `${description}\n\nBooking ID: ${bookingId}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.json({ success: false, error: error.message });
            } else {
                console.log('Email sent: ' + info.response);
                res.json({ success: true });
            }
        });

    }
    catch (error) {
        console.error('Error fetching layout:', error);
        res.status(500).send('Error rejecting ad');
    }
});

const renderCancelledBookings = asyncHandler(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.redirect('/publisher/login');
        }

        const user = await Publisher.findById(userId);
        if (!user) {
            return res.redirect('/publisher/login');
        }

        const newspaperName = user.newspaperName;

        const cancelledBookings = await CancelledBookings.find({ newspaperName });

        const formattedCancellations = cancelledBookings.map(cancelledBooking => {
            const createdAt = new Date(cancelledBooking.createdAt)
                .toLocaleString(undefined, {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
                .replace(/(\d+)\/(\d+)\/(\d+)/, '$2-$1-$3');
            const publishingDate = new Date(cancelledBooking.publishingDate).toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/\//g, '-');
            return {
                createdAt: createdAt,
                publishingDate: publishingDate,
                slotId: cancelledBooking.slotId,
                newspaperName: newspaperName,
                file: cancelledBooking.file,
                cancellationId: cancelledBooking._id
            };
        });

        const refundedBookings = await Refunded.find({ newspaperName });

        const formattedRefunds = refundedBookings.map(refundedBooking => {
            const createdAt = new Date(refundedBooking.createdAt)
                .toLocaleString(undefined, {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
                .replace(/(\d+)\/(\d+)\/(\d+)/, '$2-$1-$3');
            const publishingDate = new Date(refundedBooking.publishingDate).toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/\//g, '-');
            return {
                createdAt: createdAt,
                publishingDate: publishingDate,
                slotId: refundedBooking.slotId,
                newspaperName: newspaperName,
                file: refundedBooking.file,
                cancellationId: refundedBooking._id,
                cancellationSessionId: refundedBooking.cancellationSessionId
            };
        });

        res.render('publisher_view_cancel_requests', { cancellations: formattedCancellations, refunds: formattedRefunds, activeTab: 'view-cancel-requests' });


    } catch (error) {
        console.error('Error fetching layout:', error);
        res.status(500).send('Error fetching layout');
    }
});


const refundInitiation = asyncHandler(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.redirect('/publisher/login');
        }

        const user = await Publisher.findById(userId);
        if (!user) {
            return res.redirect('/publisher/login');
        }

        const cancellationId = String(req.params.cancellationId);

        let newspaperName, cancellationDate, price, slotId;

        const cancellationObjectId = new mongoose.Types.ObjectId(cancellationId);

        const cancelledBooking = await CancelledBookings.findById(cancellationObjectId);

        newspaperName = cancelledBooking.newspaperName;
        cancellationDate = cancelledBooking.createdAt;
        price = cancelledBooking.price;
        slotId = cancelledBooking.slotId;

        console.log(price);
        console.log(newspaperName);

        const lineItems = [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: newspaperName,
                        description: `Slot ${slotId} - ${newspaperName} (${cancellationDate})`,
                    },
                    unit_amount: price * 100,
                },
                quantity: 1,
            },
        ];

        console.log(lineItems);

        const session = await stripeGateway.checkout.sessions.create({
            currency: 'inr',
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${PUBLISHER_DOMAIN}/refund/success`,
            cancel_url: `${PUBLISHER_DOMAIN}/refund/failure`,
            line_items: lineItems,
            billing_address_collection: 'required',
        });

        const sessionId = session.id;
        const url = session.url;

        res.cookie('sessionId', sessionId, { httpOnly: true });
        res.cookie('sessionUrl', url, { httpOnly: true });

        const newTemporaryRefund = new TemporaryRefund({
            userId: cancelledBooking.userId,
            publishingDate: cancelledBooking.publishingDate,
            slotId: cancelledBooking.slotId,
            newspaperName: cancelledBooking.newspaperName,
            file: cancelledBooking.file,
            price: cancelledBooking.price,
            sessionId: cancelledBooking.sessionId,
            cancellationSessionId: sessionId,
        });

        await newTemporaryRefund.save();

        res.redirect(url);

    }
    catch (error) {
        console.log("couldnt initiate refund!", error);
        res.redirect('/publisher/view-cancel-requests');
    }
});


const renderRefundSuccessPage = asyncHandler(async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.redirect('/publisher/login');
        }

        const user = await Publisher.findById(userId);
        if (!user) {
            return res.redirect('/publisher/login');
        }

        const cancellationSessionId = req.cookies.sessionId;;

        const temporaryRefundData = await TemporaryRefund.findOne({ cancellationSessionId: cancellationSessionId });

        const newRefund = new Refunded({
            userId: temporaryRefundData.userId,
            publishingDate: temporaryRefundData.publishingDate,
            slotId: temporaryRefundData.slotId,
            newspaperName: temporaryRefundData.newspaperName,
            file: temporaryRefundData.file,
            price: temporaryRefundData.price,
            sessionId: temporaryRefundData.sessionId,
            cancellationSessionId: cancellationSessionId,
        });

        await newRefund.save();

        await TemporaryRefund.deleteOne({ cancellationSessionId: cancellationSessionId });

        await CancelledBookings.deleteOne({ sessionId: temporaryRefundData.sessionId });

        res.render('refundSuccess',);

    }
    catch (error) {
        console.log(error);
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
    req.logout(function (err) {
        if (err) { return next(err); }
        req.session.loggedIn = false;
        req.session.destroy()
        res.clearCookie('userId');
        res.redirect('/publisher/login')
    });
});


const renderSuccessPage = asyncHandler(async (req, res) => {
    try {

        const sessionId = req.session.sessionId;

        const temporaryRequest = await TemporaryRequest.findOne({ sessionId: sessionId });

        if (!temporaryRequest) {
            return res.status(404).send('Temporary request not found');
        }

        const newRequest = new Request({
            fullName: temporaryRequest.fullName,
            organizationName: temporaryRequest.organizationName,
            newspaperName: temporaryRequest.newspaperName,
            username: temporaryRequest.username,
            password: temporaryRequest.password,
            mobileNumber: temporaryRequest.mobileNumber,
            email: temporaryRequest.email,
            state: temporaryRequest.state,
            district: temporaryRequest.district,
            buildingName: temporaryRequest.buildingName,
            pincode: temporaryRequest.pincode,
            advertisementSlots: temporaryRequest.advertisementSlots,
            fileFormat: temporaryRequest.fileFormat,
            paymentmethods: temporaryRequest.paymentmethods,
            customerService: temporaryRequest.customerService,
            language: temporaryRequest.language,
            bookingDeadline: temporaryRequest.bookingDeadline,
            cancellationRefundPolicy: temporaryRequest.cancellationRefundPolicy,
            contentGuidelines: temporaryRequest.contentGuidelines,
            advertisementSubmissionGuidelines: temporaryRequest.advertisementSubmissionGuidelines,
            cancellationDeadline: temporaryRequest.cancellationDeadline,
            layout: temporaryRequest.layout,
            sessionId: sessionId
        });

        await newRequest.save();

        await TemporaryRequest.deleteOne({ sessionId: sessionId });


        res.render('publisher_request_success', { sessionId: sessionId });
    } catch (error) {
        console.log(error);
    }
});


const renderCancelPage = asyncHandler(async (req, res) => {
    try {
        const sessionId = req.session.sessionId;

        await TemporaryRequest.deleteOne({ sessionId: sessionId });

        res.send('failure');
    } catch (error) {
        console.log(error);
    }
});




const publisherRequest = async (req, res) => {
    try {

        const { fullName, organizationName, newspaperName, username, password, confirmPassword,
            mobileNumber, email, state, district, buildingName, pincode,
            advertisementSlots, fileFormat, paymentmethods, customerService,
            language,
            bookingDeadline, cancellationRefundPolicy, contentGuidelines,
            advertisementSubmissionGuidelines, cancellationDeadline } = req.body;

        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).json({ error: 'Please upload a PDF file' });
        }

        const existingPublisher = await Request.findOne({ $or: [{ email }, { newspaperName }] });

        if (existingPublisher) {
            console.error('Publisher with the same email or newspaper name already exists');
            return res.status(400).json({ error: 'Publisher with the same email or newspaper name already requested' });
        }

        if (password !== confirmPassword) {
            console.error('Passwords do not match');
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { originalname, buffer, mimetype } = req.file;

        const lineItems = [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: fullName,
                        description: `${username} - ${newspaperName} (${organizationName})`,
                    },
                    unit_amount: 10000 * 100,
                },
                quantity: 1,
            }
        ];

        const session = await stripeGateway.checkout.sessions.create({
            currency: 'inr',
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${PUBLISHER_DOMAIN}/publisher-request/success`,
            cancel_url: `${PUBLISHER_DOMAIN}/publisher-request/cancel`,
            line_items: lineItems,
            billing_address_collection: 'required'
        });

        req.session.sessionId = session.id;

        const newTemporaryRequest = new TemporaryRequest({
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
            cancellationDeadline,
            sessionId: session.id,
            layout: {
                data: buffer,
                contentType: mimetype
            }
        });

        await newTemporaryRequest.save();

        res.status(201).json(session.url);

    } catch (error) {
        console.error('Error saving request:', error);
        return res.status(500).json({ error: 'Error saving request' });
    }
};




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




module.exports = {
    loginPublisher,
    renderDashboard,
    renderSetBookings,
    setBookingDates,
    deleteDate,
    renderPublisherAccountDetails,
    updatePublisherAccountDetails,
    logoutPublisher,
    publisherRequest,
    viewLayout,
    renderViewBookings,
    renderRejectBooking,
    rejectBooking,
    renderBookedLayout,
    sendBookedDetails,
    renderSlotsPricing,
    SaveSlotsPricing,
    renderCancelledBookings,
    refundInitiation,
    renderSuccessPage,
    renderCancelPage,
    renderRefundSuccessPage
}
