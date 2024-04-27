
function fetchBookedSlotDetails() {
    return new Promise((resolve, reject) => {
        const url = new URL(window.location.href);
        const pathnameParts = url.pathname.split('/');
        const newspaperName = pathnameParts[3];
        const publishingDate = pathnameParts[4];
        
        fetch(`/publisher/view-layout/${newspaperName}/${publishingDate}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch booked slot details');
                }
                return response.json();
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}


fetchBookedSlotDetails()
    .then(bookedSlotDetails => {
        console.log('Booked slot details:', bookedSlotDetails);
        updateUIWithBookedSlotDetails(bookedSlotDetails);
    })
    .catch(error => {
        console.error('Error fetching booked slot details:', error);
    });

    function updateUIWithBookedSlotDetails(bookedSlotDetails) {
        bookedSlotDetails.forEach(slotDetails => {
            const slotId = slotDetails.slotId;
            console.log(slotId);
            const slotElement = document.getElementById(slotId);
            console.log(slotElement);
            if (slotElement && slotDetails.file) {
                slotElement.classList.add('booked');
                console.log('Image Data:', slotDetails.file.data);
                console.log('Content Type:', slotDetails.file.contentType);
                
                const imageData = slotDetails.file.data;
                const contentType = slotDetails.file.contentType;
                const base64Image = arrayBufferToBase64(imageData);                
                console.log('Base64 Image:', base64Image);
                slotElement.style.backgroundImage = `url('data:${contentType};base64,${base64Image}')`;
                slotElement.style.backgroundSize = 'contain';

            }
        });
    }
    
    
    function arrayBufferToBase64(buffer) {
        const uint8Array = new Uint8Array(buffer.data);
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        return window.btoa(binary);
    }
    
    