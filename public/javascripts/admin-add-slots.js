document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('slotForm');
    const slotFieldsDiv = document.getElementById('slotFields');
    const addSlotButton = document.getElementById('addSlotButton');
    let slotCount = 1;

    // Function to add slot input fields
    function addSlotInput() {
        const slotRow = document.createElement('div');
        slotRow.classList.add('form-group');

        const nameLabel = document.createElement('label');
        nameLabel.textContent = `Slot ${slotCount} Name or Number:`;
        slotRow.appendChild(nameLabel);

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.name = `slotName${slotCount}`;
        nameInput.required = true;
        slotRow.appendChild(nameInput);

        slotFieldsDiv.appendChild(slotRow);
        slotCount++;
    }

    // Add initial slot input field
    addSlotInput();

    // Event listener for adding new slot input fields
    addSlotButton.addEventListener('click', function() {
        addSlotInput();
    });

    // Event listener for form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Gather form data
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
            }
        }

        // Send form data to backend
        fetch('/admin/initialize-slots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to initialize slots');
            }
            return response.json();
        })
        .then(data => {
            alert('Slots initialized successfully');
            console.log('Response from server:', data);
            // Optionally, redirect or update UI
        })
        .catch(error => {
            console.error('Error initializing slots:', error);
            alert('Failed to initialize slots. Please try again.');
        });
    });
});
