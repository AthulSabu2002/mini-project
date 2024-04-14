document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('slotForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const requestBody = {};

        for (const [key, value] of formData.entries()) {
            if (key === 'newspaperName') {
                requestBody[key] = value;
            } else if (key.startsWith('slotName')) {
                if (!requestBody.slotNames) {
                    requestBody.slotNames = [];
                }
                requestBody.slotNames.push(value);
            } else if (key.startsWith('slotPrice')) {
                if (!requestBody.slotPrices) {
                    requestBody.slotPrices = [];
                }
                requestBody.slotPrices.push(value);
            }
        }

        fetch('/publisher/slots-pricing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save price');
            }
            return response.json();
        })
        .then(data => {
            alert('price updated successfully');
            console.log('Response from server:', data);
            // Optionally, redirect or update UI
        })
        .catch(error => {
            console.error('Failed to save pric:', error);
            alert('Failed to save price. Please try again.');
        });
    });
});
