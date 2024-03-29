const asyncHandler = require("express-async-handler");
const Request = require("../models/requestModel");
const bcrypt = require('bcrypt');


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



module.exports = { publisherRequest }