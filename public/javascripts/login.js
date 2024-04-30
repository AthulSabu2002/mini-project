const signUpButton = document.getElementById('registration');
const signInButton = document.getElementById('login1');
const container = document.getElementById('container');
const wrapper=document.querySelector('.form-box');
const signUpContainer = document.querySelector('.sign-up-container');
const signInContainer = document.querySelector('.sign-in-container');
const form = document.querySelector('form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const password1Input = document.getElementById('password1');
const password2Input = document.getElementById('password2');
const submitButton = document.querySelector('.bt2');
form.addEventListener('input', checkFormValidity);


function showSignUp() {
  signUpContainer.classList.remove('hidden');
  signInContainer.classList.add('hidden');
  signUpContainer.classList.remove("slideOutRight");
  signUpContainer.classList.add("slideInRight");
  signInContainer.classList.remove("slideInLeft");
  signInContainer.classList.add("slideOutLeft");
}

function showSignIn() {
  signUpContainer.classList.add('hidden');
  signInContainer.classList.remove('hidden');
  signUpContainer.classList.remove("slideInRight");
    signUpContainer.classList.add("slideOutRight");
    signInContainer.classList.remove("slideOutLeft");
    signInContainer.classList.add("slideInLeft");
}



if (window.matchMedia("(max-width: 767px)").matches) {
   
	signUpButton.addEventListener('click', showSignUp);
    signInButton.addEventListener('click', showSignIn);





  } else {
	signUpButton.addEventListener('click', () => {
		container.classList.add("right-panel-active");
	});
	
	signInButton.addEventListener('click', () => {
		container.classList.remove("right-panel-active");
	});
  }


const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

function validatePassword() {
  if (passwordPattern.test(password1Input.value)) {
    password2Input.setCustomValidity('');
  } else {
    password2Input.setCustomValidity('Password must contain at least one letter, one number, one special character, and be at least 8 characters long.');
  }
}

usernameInput.addEventListener("input", function() {
  if (usernameInput.value.includes(" ")) {
    document.getElementById("usernameError").innerHTML = "Username cannot contain spaces.";
  } else {
    document.getElementById("usernameError").innerHTML = "";
  }
});

emailInput.addEventListener('input', function() {
  if (emailInput.validity.valid) {
    document.getElementById("emailError").innerHTML = "";
  } else {
    document.getElementById("emailError").innerHTML = "Enter a valid Email.";
  }
});


function validatePassword() {
  if (passwordPattern.test(password1Input.value)) {
    password2Input.setCustomValidity('');
    document.getElementById("passwordError").innerHTML = "";
  } else {
    password2Input.setCustomValidity('Password must contain at least one letter, one number, one special character, and be at least 8 characters long.');
    document.getElementById("passwordError").innerHTML = "Password must contain at least one letter, one number, one special character, and be at least 8 characters long.";
  }
}

password1Input.addEventListener('input', function() {
  validatePassword();
});

password2Input.addEventListener('input', function() {
  validatePassword();
  if (password1Input.value === password2Input.value) {
    document.getElementById("password2Error").innerHTML = "";
  } else {
    document.getElementById("password2Error").innerHTML = "Passwords do not match.";
  }
});

function checkFormValidity() {
  if (form.checkValidity()) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

submitButton.addEventListener('click', function(event) {
  if (!form.checkValidity()) {
    event.preventDefault(); // Prevent form submission if it's invalid
  }
});