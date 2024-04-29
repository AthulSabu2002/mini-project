/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header')
    // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*=============== QUESTIONS ACCORDION ===============*/
const accordionItems = document.querySelectorAll('.questions__item')

accordionItems.forEach((item) =>{
    const accordionHeader = item.querySelector('.questions__header')

    accordionHeader.addEventListener('click', () =>{
        const openItem = document.querySelector('.accordion-open')

        toggleItem(item)

        if(openItem && openItem!== item){
            toggleItem(openItem)
        }
    })
})

const toggleItem = (item) =>{
    const accordionContent = item.querySelector('.questions__content')

    if(item.classList.contains('accordion-open')){
        accordionContent.removeAttribute('style')
        item.classList.remove('accordion-open')
    }else{
        accordionContent.style.height = accordionContent.scrollHeight + 'px'
        item.classList.add('accordion-open')
    }

}

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*=============== SHOW SCROLL UP ===============*/ 
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 400 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 400) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)



/*corousel effect*/
//Right Arrow & Left Arrow
let rightArrow = document.querySelector("#carousel-1 .right-arrow");
let leftArrow = document.querySelector("#carousel-1 .left-arrow");
//List of all of the screens in carousel
let screenStore = document.querySelectorAll("#carousel-1 .carousel-screen");
let numOfScreens = screenStore.length;
//List of all the circle stores
let circleStore = document.querySelectorAll("#carousel-1 .circle-container .circle");
//number to target main screen
let currentScreen = 0;
//currently in animation or not
let inAnim = false;
//Animation Time
let animTime = 500;

//Sort out starting position
sortPositioning(screenStore[currentScreen], screenStore[currentScreen - 1], screenStore[currentScreen + 1]);
//Sort out circle styling
highlightCircle(circleStore[0]);

//User clicks on rightArrow
rightArrow.addEventListener("click", () => {
    startAnim("right");
});

//User clicks on the leftArrow
leftArrow.addEventListener("click", () => {
    startAnim("left");
});

//Start animation. Either towards left or right
function startAnim(direction) {
    if(!inAnim) {
        inAnim = true;
        if(direction === "right") {
            moveRight();
            highlightCircle(circleStore[currentScreen + 1], "right");
        }else if(direction === "left"){
            moveLeft();
            highlightCircle(circleStore[currentScreen - 1], "left");
        }else{
            isAnim = false;
            return
        }
    }
}

//Move to the right
function moveRight() {
    //Move towards Next screen as usual
    if(currentScreen < numOfScreens - 1){
    toLeft(screenStore[currentScreen]);
    comeRight(screenStore[currentScreen + 1]);
    setTimeout(() => {
        inAnim = false;
        currentScreen++;
        sortPositioning(screenStore[currentScreen], screenStore[currentScreen - 1], screenStore[currentScreen + 1]);
    }, animTime)
    }else{
        //Or the screen coming in is the first screen again
        toLeft(screenStore[currentScreen]);
        comeRight(screenStore[0]);
        setTimeout(() => {
            inAnim = false;
            currentScreen = 0;
            sortPositioning(screenStore[currentScreen], screenStore[currentScreen - 1], screenStore[currentScreen + 1]);
        }, animTime)
    }
}

//Move to the left
function moveLeft() {
    //Move back to screen previously on, as usual
    if(currentScreen > 0){
        toRight(screenStore[currentScreen]);
        comeLeft(screenStore[currentScreen - 1]);
        setTimeout(() => {
        inAnim = false;
        currentScreen--;
        sortPositioning(screenStore[currentScreen], screenStore[currentScreen - 1], screenStore[currentScreen + 1]);
        }, animTime)
    }else{
        //Move back to the last screen container
        toRight(screenStore[currentScreen]);
        comeLeft(screenStore[numOfScreens - 1]);
        setTimeout(() => {
            inAnim = false;
            currentScreen = numOfScreens - 1;
            sortPositioning(screenStore[currentScreen], screenStore[currentScreen - 1], screenStore[currentScreen + 1]);
            }, animTime)
    }
}

//User clicks on one of the circles
circleStore.forEach(circle => {
    circle.addEventListener("click", event => {
        if(!inAnim){
        //Convert NodeList to Array, to use 'indexOf' method.
        let circleStoreArray = Array.prototype.slice.call(circleStore);
        let circleIndex = circleStoreArray.indexOf(event.target);
        //Configure circle styling
        highlightCircle(event.target);
        //Work out whether we need to move right or left, or nowhere.
        if(circleIndex > currentScreen){
            changeScreenCircleClick(circleIndex, "right");
        }else if (circleIndex < currentScreen){
            changeScreenCircleClick(circleIndex, "left");
        }
    }
})
})

function changeScreenCircleClick(circleIndex, direction) {
    inAnim = true;
    if(direction === "right"){
        sortPositioning(screenStore[currentScreen], screenStore[currentScreen - 1], screenStore[circleIndex]);
        toLeft(screenStore[currentScreen]);
        comeRight(screenStore[circleIndex]);
    }else if (direction === "left"){
        sortPositioning(screenStore[currentScreen], screenStore[circleIndex], screenStore[currentScreen + 1]);
        toRight(screenStore[currentScreen]);
        comeLeft(screenStore[circleIndex]);
    }else{
        inAnim = false;
        return
    }
    setTimeout(() => {
    inAnim = false;
    currentScreen = circleIndex;
    sortPositioning(screenStore[currentScreen], screenStore[currentScreen - 1], screenStore[currentScreen + 1]);
    }, animTime)
}

function highlightCircle(circleSelect, direction) {
    if(circleSelect === undefined && direction === "right"){
        circleSelect = circleStore[0];
    }else if (circleSelect === undefined && direction === "left"){
        circleSelect = circleStore[numOfScreens - 1];
    }
    circleStore.forEach(circle => {
        if(circle === circleSelect){
            circle.classList.add("circle-fill");
        }else{
            circle.classList.remove("circle-fill");
        }
    })
}


//Animation methods
function toLeft(screen) {
    screen.style.animation = "toLeft 0.5s ease-in-out forwards";
    setTimeout(() => {
        screen.style.animation = "";
    }, animTime);
}

function toRight(screen) {
    screen.style.animation = "toRight 0.5s ease-in-out forwards";
    setTimeout(() => {
        screen.style.animation = "";
    }, animTime);
}

function comeRight(screen) {
    screen.style.animation = "comeRight 0.5s ease-in-out forwards";
    setTimeout(() => {
        screen.style.animation = "";
    }, animTime);
}

function comeLeft(screen) {
    screen.style.animation = "comeLeft 0.5s ease-in-out forwards";
    setTimeout(() => {
        screen.style.animation = "";
    }, animTime);
}



//Sort positioning. Don't want images to overlap
function sortPositioning(mainScreen, leftScreen, rightScreen) {
    //If right screen is undefined. We need to repeat first screen again
    if(rightScreen === undefined){
        rightScreen = screenStore[0];
    }
    //If left screen is undefined. We use the last screen
    if(leftScreen === undefined){
        leftScreen = screenStore[numOfScreens - 1];
    }
    screenStore.forEach(screen => {
        if(screen === mainScreen){
            screen.style.display = "block";
            screen.style.left = "0px";
        }else if (screen === leftScreen){
            screen.style.display = "block";
            screen.style.left = "-100%";
        }else if (screen === rightScreen){
            screen.style.display = "block";
            screen.style.left = "100%";
        }else{
            screen.style.display = "none";
        }
    })
}

//Auto Scroll feature
let carousel = document.getElementById("carousel-1");
let scrollTime = Number(carousel.getAttribute("auto-scroll"));
//Only implement the feature if the user has included the attribute 'auto-scroll'.
if(scrollTime) {
    //Auto Scroll will be set up the very first time
    let autoWipe = setInterval(() => {
        startAnim("right");
    }, scrollTime);
    //Clear the timer when they hover on carousel
    carousel.addEventListener("mouseenter", () => {
        clearInterval(autoWipe);
    });
    //Re-initialise the timer when they hover out of the carousel
    carousel.addEventListener("mouseleave", () => {
         autoWipe = setInterval(() => {
            startAnim("right");
        }, scrollTime);
    })

}



$(document).ready(function() {
    $('.profile-btn').click(function() {
        $('.profile-dropdown').toggleClass('show');
    });

    // Close the dropdown if clicked outside
    $(document).click(function(e) {
        if (!$(e.target).closest('.profile-container').length) {
            $('.profile-dropdown').removeClass('show');
        }
    });
});




/*11logout btn*/
const logoutBtn = document.querySelector('.logout-btn');

logoutBtn.addEventListener('click', () => {
  const logoutModal = document.createElement('div');
  logoutModal.classList.add('logout-modal');

  const logoutModalContent = document.createElement('div');
  logoutModalContent.classList.add('logout-modal-content');

  const message = document.createElement('p');
  message.textContent = 'Do you wish to logout?';

  const yesBtn = document.createElement('button');
  yesBtn.textContent = 'Yes';
  yesBtn.addEventListener('click', () => {
    // Handle logout logic here
    console.log('Logout clicked');
    logoutModal.remove();
  });

  const noBtn = document.createElement('button');
  noBtn.textContent = 'No';
  noBtn.addEventListener('click', () => {
    logoutModal.remove();
  });

  logoutModalContent.appendChild(message);
  logoutModalContent.appendChild(yesBtn);
  logoutModalContent.appendChild(noBtn);

  logoutModal.appendChild(logoutModalContent);

  document.body.appendChild(logoutModal);
});






/*=============== DARK LIGHT THEME ===============
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})*/ 

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true
})

sr.reveal(`.home__data`)
sr.reveal(`.home__img`, {delay: 500})
sr.reveal(`.home__social`, {delay: 600})
sr.reveal(`.about__img, .contact__box`,{origin: 'left'})
sr.reveal(`.about__data, .contact__form`,{origin: 'right'})
sr.reveal(`.steps__card, .product__card, .questions__group, .footer`,{interval: 100})