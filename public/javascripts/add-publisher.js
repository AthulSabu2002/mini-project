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
});
