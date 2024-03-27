const signUpButton = document.getElementById('registration');
const signInButton = document.getElementById('login1');
const container = document.getElementById('container');
const wrapper=document.querySelector('.form-box');
const signUpContainer = document.querySelector('.sign-up-container');
const signInContainer = document.querySelector('.sign-in-container');


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