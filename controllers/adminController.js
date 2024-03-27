const asyncHandler = require("express-async-handler");
const Publisher = require("../models/publisherModel");
const Request = require("../models/requestModel");
const bcrypt = require('bcrypt')


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
    const { username, email, password, newspaperName, language } = req.body;

    try {
        const existingPublisher = await Publisher.findOne({ $or: [{ email }, { newspaperName }] });

        if (existingPublisher) {
            return res.status(400).send("<script>alert('Publisher with the same email or newspaper name already exists.'); window.location='/admin/add-publisher';</script>");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const publisher = await Publisher.create({
            username,
            email,
            password: hashedPassword,
            newspaperName,
            language
        });

        await Request.deleteOne({ email, newspaper: newspaperName });

        return res.status(201).send("<script>alert('Publisher added successfully.'); window.location='/admin/add-publisher';</script>");
    } catch (error) {
        console.error(error);
        return res.status(500).send("<script>alert('Error adding publisher.'); window.location='/admin/add-publisher';</script>");
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




 module.exports = { addPublisher,  viewPublishers, deletePublisher, viewRequest}