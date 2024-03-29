function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fullName').value = getUrlParameter('fullName');
    document.getElementById('organizationName').value = getUrlParameter('organizationName');
    document.getElementById('email').value = getUrlParameter('email');
    document.getElementById('newspaperName').value = getUrlParameter('newspaperName');
    document.getElementById('username').value = getUrlParameter('username');
    document.getElementById('password').value = getUrlParameter('password');
    document.getElementById('confirmPassword').value = getUrlParameter('password');
    document.getElementById('mobileNumber').value = getUrlParameter('mobileNumber');
    document.getElementById('state').value = getUrlParameter('state');
    document.getElementById('district').value = getUrlParameter('district');
    document.getElementById('buildingName').value = getUrlParameter('buildingName');
    document.getElementById('pincode').value = getUrlParameter('pincode');
    document.getElementById('advertisementSlots').value = getUrlParameter('advertisementSlots');
    document.getElementById('fileFormat').value = getUrlParameter('fileFormat');
    document.getElementById('paymentmethods').value = getUrlParameter('paymentmethods');
    document.getElementById('customerService').value = getUrlParameter('customerService');
    document.getElementById('bookingDeadline').value = getUrlParameter('bookingDeadline');
    document.getElementById('cancellationRefundPolicy').value = getUrlParameter('cancellationRefundPolicy');
    document.getElementById('contentGuidelines').value = getUrlParameter('contentGuidelines');
    document.getElementById('advertisementSubmissionGuidelines').value = getUrlParameter('advertisementSubmissionGuidelines');
    document.getElementById('cancellationDeadline').value = getUrlParameter('cancellationDeadline');
    document.getElementById('language').value = getUrlParameter('language');


    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => input.disabled = true);


    document.getElementById('submit').addEventListener('click', function(event) {
        event.preventDefault(); 
        console.log('saving publisher');
        const publisherData = {
            fullName: document.getElementById('fullName').value,
            organizationName: document.getElementById('organizationName').value,
            email: document.getElementById('email').value,
            newspaperName: document.getElementById('newspaperName').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            mobileNumber: document.getElementById('mobileNumber').value,
            state: document.getElementById('state').value,
            district: document.getElementById('district').value,
            buildingName: document.getElementById('buildingName').value,
            pincode: document.getElementById('pincode').value,
            advertisementSlots: document.getElementById('advertisementSlots').value,
            fileFormat: document.getElementById('fileFormat').value,
            paymentmethods: document.getElementById('paymentmethods').value,
            customerService: document.getElementById('customerService').value,
            bookingDeadline: document.getElementById('bookingDeadline').value,
            cancellationRefundPolicy: document.getElementById('cancellationRefundPolicy').value,
            contentGuidelines: document.getElementById('contentGuidelines').value,
            advertisementSubmissionGuidelines: document.getElementById('advertisementSubmissionGuidelines').value,
            cancellationDeadline: document.getElementById('cancellationDeadline').value,
            language: document.getElementById('language').value
        };

        // Send AJAX request to server
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/admin/add-publisher', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // Handle success response from server
                    alert('Publisher saved successfully!');
                    window.location.href = '/admin/view-requests';
                } else {
                    alert('Failed to save publisher!');
                    console.error('Failed to save publisher:', xhr.responseText);
                }
            }
        };
        xhr.send(JSON.stringify(publisherData));

    });
});
