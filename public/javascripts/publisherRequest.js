document.getElementById('publisherRequestForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    try {
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
            throw new Error('Passwords do not match');
        }

        const formData = new FormData();

        // Append form fields
        formData.append('fullName', fullName);
        formData.append('organizationName', organizationName);
        formData.append('newspaperName', newspaperName);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);
        formData.append('mobileNumber', mobileNumber);
        formData.append('email', email);
        formData.append('state', state);
        formData.append('district', district);
        formData.append('buildingName', buildingName);
        formData.append('pincode', pincode);
        formData.append('advertisementSlots', advertisementSlots);
        formData.append('fileFormat', fileFormat);
        formData.append('paymentmethods', paymentmethods);
        formData.append('customerService', customerService);
        formData.append('language', language);
        formData.append('bookingDeadline', bookingDeadline);
        formData.append('cancellationRefundPolicy', cancellationRefundPolicy);
        formData.append('contentGuidelines', contentGuidelines);
        formData.append('advertisementSubmissionGuidelines', advertisementSubmissionGuidelines);
        formData.append('cancellationDeadline', cancellationDeadline);

        // Append PDF file
        const pdfFile = document.getElementById('layout').files[0];
        formData.append('layout', pdfFile);

        // Print form data to console
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }

        fetch('/publisher/stripe-checkout', {
            method: 'POST',
            body: formData,
        })
        .then((response) =>
                response.json()
        )
        .then((url) => {
            location.href = url;
        })
        .catch(error => {
            console.error('Error:', error);
            console.log('Error occurred');
            location.href = '/publisher/request'
        });
    } catch (error) {
        console.error('Error:', error);
        console.log(error.message || 'An error occurred');
        location.href = '/publisher/request'
    }
});
