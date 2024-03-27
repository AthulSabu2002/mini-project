document.getElementById('publisherRequestForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const formData = new FormData(this);
    const jsonObject = {};
    formData.forEach((value, key) => {
        jsonObject[key] = value;
    });

    fetch('/publishers/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonObject)
    })
    .then(response => {
        if (response.ok) {
            alert('Request sent successfully!');
        } else {
            alert('Error occurred. Please try again later.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error occurred. Please try again later.');
    });
});