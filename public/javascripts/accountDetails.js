const form = document.querySelector("form"),
      nextBtn = form.querySelector(".nextBtn"),
      backBtn = form.querySelector(".backBtn"),
      allInput = form.querySelectorAll(".first input"),
      submitBtn = form.querySelector("#submit"); 

nextBtn.addEventListener("click", (event) => {
    event.preventDefault();

    allInput.forEach(input => {
        if (input.value !== "") {
            form.classList.add('secActive'); 
        } else {
            form.classList.remove('secActive'); 
            alert('Please fill all the fields..');
            return;
        }
    });
});

backBtn.addEventListener("click", (event) => {
    event.preventDefault(); 
    form.classList.remove('secActive'); 
});


submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();


    let isValid = true;
    allInput.forEach(input => {
        if (input.value === "") {
            isValid = false;
            return;
        }
    });

    if (!isValid) {
        alert('Please fill all the fields');
        return;
    }

    const formData = {
        fullName: document.getElementById('fullName').value,
        organizationName: document.getElementById('organizationName').value,
        newspaperName: document.getElementById('newspaperName').value,
        username: document.getElementById('username').value,
        mobileNumber: document.getElementById('mobileNumber').value,
        email: document.getElementById('email').value,
        state: document.getElementById('state').value,
        district: document.getElementById('district').value,
        buildingName: document.getElementById('buildingName').value,
        pincode: document.getElementById('pincode').value,
        advertisementSlots: document.getElementById('advertisementSlots').value,
        fileFormat: document.getElementById('fileFormat').value,
        paymentmethods: document.getElementById('paymentmethods').value,
        customerService: document.getElementById('customerService').value,
        language: document.getElementById('language').value,
        bookingDeadline: document.getElementById('bookingDeadline').value,
        cancellationRefundPolicy: document.getElementById('cancellationRefundPolicy').value,
        contentGuidelines: document.getElementById('contentGuidelines').value,
        advertisementSubmissionGuidelines: document.getElementById('advertisementSubmissionGuidelines').value,
        cancellationDeadline: document.getElementById('cancellationDeadline').value
    };

    try {
        const response = await fetch('/publisher/account-details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to update user details');
        }

        alert('User details updated successfully!');
        window.location='/publisher/account-details';
    } catch (error) {
        console.error('Error updating user details:', error);
        alert('Failed to update user details. Please try again.');
    }
});
