function approveRequest(
    fullName, organizationName, email, newspaperName, username, password, confirmPassword,
    mobileNumber, state, district, buildingName, pincode,
    advertisementSlots, fileFormat, paymentmethods, customerService,
    bookingDeadline, cancellationRefundPolicy, contentGuidelines,
    advertisementSubmissionGuidelines, cancellationDeadline, language
) {
    // Construct the URL with encoded parameters
    const url = '/admin/add-publisher?' +
        'fullName=' + encodeURIComponent(fullName) +
        '&organizationName=' + encodeURIComponent(organizationName) +
        '&email=' + encodeURIComponent(email) +
        '&newspaperName=' + encodeURIComponent(newspaperName) +
        '&username=' + encodeURIComponent(username) +
        '&password=' + encodeURIComponent(password) +
        '&confirmPassword=' + encodeURIComponent(password) +
        '&mobileNumber=' + encodeURIComponent(mobileNumber) +
        '&state=' + encodeURIComponent(state) +
        '&district=' + encodeURIComponent(district) +
        '&buildingName=' + encodeURIComponent(buildingName) +
        '&pincode=' + encodeURIComponent(pincode) +
        '&advertisementSlots=' + encodeURIComponent(advertisementSlots) +
        '&fileFormat=' + encodeURIComponent(fileFormat) +
        '&paymentmethods=' + encodeURIComponent(paymentmethods) +
        '&customerService=' + encodeURIComponent(customerService) +
        '&bookingDeadline=' + encodeURIComponent(bookingDeadline) +
        '&cancellationRefundPolicy=' + encodeURIComponent(cancellationRefundPolicy) +
        '&contentGuidelines=' + encodeURIComponent(contentGuidelines) +
        '&advertisementSubmissionGuidelines=' + encodeURIComponent(advertisementSubmissionGuidelines) +
        '&cancellationDeadline=' + encodeURIComponent(cancellationDeadline) +
        '&language=' + encodeURIComponent(language);

    window.location.href = url;
}




// function approveRequest(requestId, name, email, newspaper, language) {
//     window.location.href = '/admin/add-publisher?name=' + encodeURIComponent(name) +
//                                 '&email=' + encodeURIComponent(email) +
//                                 '&newspaper=' + encodeURIComponent(newspaper) +
//                                 '&language=' + encodeURIComponent(language);
// }