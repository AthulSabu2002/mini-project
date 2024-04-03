function approveRequest(
    fullName, organizationName, email, newspaperName, username, password, confirmPassword,
    mobileNumber, state, district, buildingName, pincode,
    advertisementSlots, fileFormat, paymentmethods, customerService,
    bookingDeadline, cancellationRefundPolicy, contentGuidelines,
    advertisementSubmissionGuidelines, cancellationDeadline, language, layoutFile
) {
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('organizationName', organizationName);
    formData.append('email', email);
    formData.append('newspaperName', newspaperName);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    formData.append('mobileNumber', mobileNumber);
    formData.append('state', state);
    formData.append('district', district);
    formData.append('buildingName', buildingName);
    formData.append('pincode', pincode);
    formData.append('advertisementSlots', advertisementSlots);
    formData.append('fileFormat', fileFormat);
    formData.append('paymentmethods', paymentmethods);
    formData.append('customerService', customerService);
    formData.append('bookingDeadline', bookingDeadline);
    formData.append('cancellationRefundPolicy', cancellationRefundPolicy);
    formData.append('contentGuidelines', contentGuidelines);
    formData.append('advertisementSubmissionGuidelines', advertisementSubmissionGuidelines);
    formData.append('cancellationDeadline', cancellationDeadline);
    formData.append('language', language);
    formData.append('layout', layoutFile);

    // Create query string from FormData
    const queryString = new URLSearchParams(formData).toString();

    const url = '/admin/add-publisher?' + queryString;

    window.location.href = url;
}





// function approveRequest(
//     fullName, organizationName, email, newspaperName, username, password, confirmPassword,
//     mobileNumber, state, district, buildingName, pincode,
//     advertisementSlots, fileFormat, paymentmethods, customerService,
//     bookingDeadline, cancellationRefundPolicy, contentGuidelines,
//     advertisementSubmissionGuidelines, cancellationDeadline, language
// ) {

//     const url = '/admin/add-publisher?' +
//         'fullName=' + encodeURIComponent(fullName) +
//         '&organizationName=' + encodeURIComponent(organizationName) +
//         '&email=' + encodeURIComponent(email) +
//         '&newspaperName=' + encodeURIComponent(newspaperName) +
//         '&username=' + encodeURIComponent(username) +
//         '&password=' + encodeURIComponent(password) +
//         '&confirmPassword=' + encodeURIComponent(password) +
//         '&mobileNumber=' + encodeURIComponent(mobileNumber) +
//         '&state=' + encodeURIComponent(state) +
//         '&district=' + encodeURIComponent(district) +
//         '&buildingName=' + encodeURIComponent(buildingName) +
//         '&pincode=' + encodeURIComponent(pincode) +
//         '&advertisementSlots=' + encodeURIComponent(advertisementSlots) +
//         '&fileFormat=' + encodeURIComponent(fileFormat) +
//         '&paymentmethods=' + encodeURIComponent(paymentmethods) +
//         '&customerService=' + encodeURIComponent(customerService) +
//         '&bookingDeadline=' + encodeURIComponent(bookingDeadline) +
//         '&cancellationRefundPolicy=' + encodeURIComponent(cancellationRefundPolicy) +
//         '&contentGuidelines=' + encodeURIComponent(contentGuidelines) +
//         '&advertisementSubmissionGuidelines=' + encodeURIComponent(advertisementSubmissionGuidelines) +
//         '&cancellationDeadline=' + encodeURIComponent(cancellationDeadline) +
//         '&language=' + encodeURIComponent(language);

//     window.location.href = url;
// }
