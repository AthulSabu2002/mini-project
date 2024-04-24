const inputs = document.querySelectorAll(".input-field");
const main = document.querySelector("main");
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");

inputs.forEach((inp) => {
  inp.addEventListener("focus", () => {
    inp.classList.add("active");
  });
  inp.addEventListener("blur", () => {
    if (inp.value != "") return;
    inp.classList.remove("active");
  });
});


function moveSlider(index) {
  let currentImage = document.querySelector(`.img-${index}`);
  images.forEach((img) => img.classList.remove("show"));
  currentImage.classList.add("show");
  const textSlider = document.querySelector(".text-group");
  textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;
  bullets.forEach((bull) => bull.classList.remove("active"));
  const activeBullet = document.querySelector(`.bullet[data-value="${index}"]`);
  activeBullet.classList.add("active");
}

let currentIndex = 0;
const slideDuration = 3000;

function autoSlide() {
  currentIndex++;
  if (currentIndex > bullets.length) {
    currentIndex = 1;
  }
  moveSlider(currentIndex);
}

const autoSlideInterval = setInterval(autoSlide, slideDuration);