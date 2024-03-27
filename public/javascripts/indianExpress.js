document.addEventListener('DOMContentLoaded', function() {
    
    var selectedDivs = []; 
    var adAreas = document.querySelectorAll('[class^="ad-area-"]');

    adAreas.forEach(function(adArea) {

        adArea.addEventListener('click', function() {

            if (selectedDivs.includes(adArea)) {
                adArea.style.backgroundColor = '';
                selectedDivs.splice(selectedDivs.indexOf(adArea), 1); 
            } else {
                adArea.style.backgroundColor = 'rgb(56, 247, 56)';
                selectedDivs.push(adArea); 
            }

  
            var stickyContainer = document.getElementById('sticky-container');
            if (selectedDivs.length > 0) {
                stickyContainer.style.display = 'block';
            } else {
                stickyContainer.style.display = 'none';
            }


            var selectedNames = document.getElementById('selected-names');
            selectedNames.textContent = selectedDivs.map(function(div) {
                return div.getAttribute('class').split(' ')[1];
            }).join('');
        });
    });
});