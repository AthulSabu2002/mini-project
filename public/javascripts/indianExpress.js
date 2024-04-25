document.addEventListener('DOMContentLoaded', function() {
    var selectedDivs = []; 

    var unbookedAreas = document.querySelectorAll('.unbooked');

    unbookedAreas.forEach(function(adArea) {
        adArea.addEventListener('click', function() {
            if (selectedDivs.includes(adArea)) {
                selectedDivs = [];
                adArea.style.backgroundColor = '';
            } else {
                if (selectedDivs.length > 0) {
                    selectedDivs[0].style.backgroundColor = '';
                  }
                  selectedDivs = [adArea]; 
                  adArea.style.backgroundColor = '#0be881';
            }

            var stickyContainer = document.getElementById('sticky-container');
            if (selectedDivs.length > 0) {
                stickyContainer.style.display = 'block';
            } else {
                stickyContainer.style.display = 'none';
            }

        });
    });

    var uploadDiv = document.getElementById('uploadDiv');
    var confirmUploadDiv = document.getElementById('confirmUploadDiv');
    var imageInput = document.getElementById('imageInput');
    var confirmImageInput = document.getElementById('confirmImageInput');
    var uploadButton = document.getElementById('uploadButton');
    var confirmBookingButton = document.getElementById('confirmBookingButton');
    var bookSlotButton = document.getElementById('book-slot-button');

    var closeUploadDiv = document.getElementById('closeUploadDiv');
    if (closeUploadDiv) {
        closeUploadDiv.addEventListener('click', function() {
            uploadDiv.style.display = 'none';
        });
    }

    var closeConfirmUploadDiv = document.getElementById('closeConfirmUploadDiv');
    if (closeConfirmUploadDiv) {
        closeConfirmUploadDiv.addEventListener('click', function() {
            confirmUploadDiv.style.display = 'none';
        });
    }


    var showUploadBtn = document.getElementById('preview-button');
    showUploadBtn.addEventListener('click', function() {
        uploadDiv.style.display = 'block';
        uploadButton.onclick = function() {
            var file = imageInput.files[0];
            if (file) {
                var selectedAdArea = selectedDivs[0];
                if (selectedAdArea) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = 'Uploaded Ad';
                        
                        var adAreaWidth = selectedAdArea.offsetWidth;
                        var adAreaHeight = selectedAdArea.offsetHeight;
                        img.style.width = adAreaWidth + 'px';
                        selectedAdArea.style.backgroundSize = 'contain'
                        img.style.height = adAreaHeight + 'px';
                        
                        // img.style.objectFit = 'cover';
                        
                        selectedAdArea.innerHTML = '';
                        selectedAdArea.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                    imageInput.value = '';
                    uploadDiv.style.display = 'none';
                    confirmUploadDiv.style.display = 'block';
                } else {
                    alert('Please select an ad area.');
                }
            } else {
                alert('Please select a file to upload.');
            }
        };
    });

    bookSlotButton.addEventListener('click', function() {

        uploadDiv.style.display = 'none';

        confirmUploadDiv.style.display = 'block';
    }); 

    confirmBookingButton.addEventListener('click', function() {
        var file = confirmImageInput.files[0];
        if (file) {
            var selectedAdArea = selectedDivs[0];
            if (selectedAdArea) {
                var slotId = selectedAdArea.id;
                var newspaperName = window.location.pathname.split('/')[3]; 
                console.log(slotId);
                console.log(newspaperName);
    
                var formData = new FormData();
                formData.append('file', file);
                formData.append('slotId', slotId);
                formData.append('newspaperName', newspaperName); 
    
                fetch('/users/stripe-checkout', {
                    method: 'POST',
                    body: formData
                })
                .then((response) =>
                    response.json()
                )
                .then((url) => {
                    location.href = url;
                })
                .catch(error => {
                    console.error('Error booking slot:', error);
                    alert('Failed to book slot. Please try again.');
                });
            } else {
                alert('Please select an ad area.');
            }
        } else {
            alert('Please select a file to upload.');
        }
    });    
});
