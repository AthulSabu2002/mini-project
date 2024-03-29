document.getElementById('publisherRequestForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const fullName = document.getElementById('fullName').value;
    const organizationName = document.getElementById('organizationName').value;
    const newspaperName = document.getElementById('newspaperName').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const mobileNumber = document.getElementById('mobileNumber').value;
    const email = document.getElementById('email').value;
    const state = document.getElementById('state').value;
    const district = document.getElementById('district').value;
    const buildingName = document.getElementById('buildingName').value;
    const pincode = document.getElementById('pincode').value;
    const advertisementSlots = document.getElementById('advertisementSlots').value;
    const fileFormat = document.getElementById('fileFormat').value;
    const paymentmethods = document.getElementById('paymentmethods').value;
    const customerService = document.getElementById('customerService').value;
    const language = document.getElementById('language').value;
    const bookingDeadline = document.getElementById('bookingDeadline').value;
    const cancellationRefundPolicy = document.getElementById('cancellationRefundPolicy').value;
    const contentGuidelines = document.getElementById('contentGuidelines').value;
    const advertisementSubmissionGuidelines = document.getElementById('advertisementSubmissionGuidelines').value;
    const cancellationDeadline = document.getElementById('cancellationDeadline').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const formData = {
        fullName,
        organizationName,
        newspaperName,
        username,
        password,
        confirmPassword,
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
    };

    fetch('/publisher/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if (response.ok) {
            alert('Requested successfully! Status will be updated via email provided');
            window.location.href = '/publisher/request';
        } else {
            alert('Error occurred. Please try again later.');
            window.location='/publisher/request';
            return res.status(400).send("<script>window.location='/publisher/request';</script>");
        }
    })
    .catch(error => {
        alert('Error occurred. Please try again later.');
        window.location='/publisher/request';
        return res.status(400).send("<script>alert('Error occurred. Please try again later.'); window.location='/publisher/request';</script>");
    });
});















// document.getElementById('publisherRequestForm').addEventListener('submit', function(event) {
//     event.preventDefault(); 
    
//     const formData = new FormData(this);
//     const jsonObject = {};
//     formData.forEach((value, key) => {
//         jsonObject[key] = value;
//     });

//     fetch('/publishers/request', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(jsonObject)
//     })
//     .then(response => {
//         if (response.ok) {
//             alert('Request sent successfully!');
//         } else {
//             alert('Error occurred. Please try again later.');
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('Error occurred. Please try again later.');
//     });
// });