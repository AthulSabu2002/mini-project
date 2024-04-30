const form = document.getElementById('account-form');
const inputs = form.querySelectorAll('input');
const editBtn = document.getElementById('edit-btn');
let isEditing = false;

editBtn.addEventListener('click', () => {
  isEditing = !isEditing;
  inputs.forEach(input => {
    input.readOnly = !isEditing;
  });
  editBtn.textContent = isEditing ? 'Save' : 'Edit';

  if (!isEditing) {
    const validationPassed = validateInputs();
    if (validationPassed) {
      const formData = {};
      formData.email = document.getElementById('email').value;
      formData.username = document.getElementById('username').value;
      formData.mobile = document.getElementById('mobileNumber').value;
      console.log(formData);
      sendDataToServer(formData);
    }
  }
});

function validateInputs() {
  const emailInput = form.querySelector('input[type="email"]');
  const usernameInput = form.querySelector('input[name="username"]');

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;

  let isValid = true;

  if (emailInput && !emailRegex.test(emailInput.value)) {
    alert('Please enter a valid email address');
    isValid = false;
  }

  if (usernameInput && !usernameRegex.test(usernameInput.value)) {
    alert('Username must be between 4 and 20 characters and can only contain letters, numbers, and underscores');
    isValid = false;
  }


  return isValid;
}

function sendDataToServer(formData) {
  fetch('/users/dashboard/profile/update-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (response.ok) {
      // Server replied with a success status
      alert('Data updated successfully');
    } else {
      // Server replied with an error status
      alert('Failed to update data');
    }
  })
  .catch(error => {
    // Network error or other error
    console.error('Error:', error);
    alert('An error occurred while updating data');
  });
}