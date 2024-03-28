const form = document.querySelector("form"),
      nextBtn = form.querySelector(".nextBtn"),
      backBtn = form.querySelector(".backBtn"),
      allInput = form.querySelectorAll(".first input");

      nextBtn.addEventListener("click", (event) => {
        event.preventDefault();
    
        allInput.forEach(input => {
            if (input.value !== "") {
                form.classList.add('secActive'); 
                console.log('hiii'); 
            } else {
                form.classList.remove('secActive'); 
                alert('please fill the fields')
                exit();
            }
        });
    });
    

backBtn.addEventListener("click", (event) => {
    event.preventDefault(); 
    form.classList.remove('secActive'); 
});
