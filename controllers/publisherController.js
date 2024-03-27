const asyncHandler = require("express-async-handler");
const Request = require("../models/requestModel");


const publisherRequest = asyncHandler(async (req, res) => {
    try {
        const { name, email, newspaper, language } = req.body;

        const newRequest = new Request({
            name,
            email,
            newspaper,
            language
        });

        await newRequest.save();

        res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
        console.error('Error saving request:', error);
        res.status(500).json({ success: false, error: 'Error saving request' });
    }
});



module.exports = { publisherRequest }