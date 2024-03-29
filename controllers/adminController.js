const asyncHandler = require("express-async-handler");
const Publisher = require("../models/publisherModel");
const Request = require("../models/requestModel");
const bcrypt = require('bcrypt')
const Layout = require("../models/newsPaperLayout");

const renderAddPublisher = asyncHandler(async (req, res) => {
    try {
        res.render('addPublisher', { activeTab: 'add-publisher' })
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
        res.render('adminDashboard', { requests: requests, requestCount: requestCount, publisherCount: publisherCount,  activeTab: 'dashboard' });
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



const addPublisher = asyncHandler(async (req, res) => {

    try {
        
        const { fullName, organizationName, newspaperName, username, password, confirmPassword, 
                mobileNumber, email, state, district, buildingName, pincode,
                advertisementSlots, fileFormat, paymentmethods, customerService,
                language,
                bookingDeadline, cancellationRefundPolicy, contentGuidelines,
                advertisementSubmissionGuidelines, cancellationDeadline } = req.body;

        const existingPublisher = await Publisher.findOne({ $or: [{ email }, { newspaperName }] });

        console.log(existingPublisher);

        if (existingPublisher) {
            console.log('Publisher with the same email or newspaper name already exists.')
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
            cancellationDeadline
        });


        await newPublisher.save();

        const existingLayout = await Layout.findOne({ $or: [{ email }, { newspaperName }] });

        console.log(existingLayout);

        if (existingLayout) {
            console.log('Layout with the same email or newspaper name already exists.')
            return res.status(400).json({ error: 'Publisher with the same email or newspaper name already exists.' });
        }

        const layout = new Layout({
            newspaperName,
            email,
            layoutName: newspaperName
        });

        try{
            await layout.save();
        }
        catch(error){
            consolr.log('Cannot save layout')
        }

        try {
            await Request.deleteOne({ email, newspaperName: newspaperName });
            console.log('Request deleted successfully');
        } catch (error) {
            console.error('Error deleting request:', error);
        }

        return res.status(200).json({ message: 'Publisher added successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error adding publisher.' });
    }
})


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




module.exports = { addPublisher,  viewPublishers, deletePublisher, viewRequest, renderDashboard, renderAddPublisher, deleteRequest}