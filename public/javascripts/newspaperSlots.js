document.getElementById('addSlot').addEventListener('click', function() {
    const slotFields = document.getElementById('slotFields');
    const slotCount = slotFields.querySelectorAll('.slot').length + 1;
    
    const newSlotDiv = document.createElement('div');
    newSlotDiv.classList.add('slot');
    newSlotDiv.innerHTML = `
        <h3>Slot ${slotCount}</h3>
        <label for="slot${slotCount}_html_id">Slot HTML ID:</label><br>
        <input type="text" id="slot${slotCount}_html_id" name="slot_html_id[]"><br>
        <label for="slot${slotCount}_width">Width:</label><br>
        <input type="number" id="slot${slotCount}_width" name="width[]"><br>
        <label for="slot${slotCount}_height">Height:</label><br>
        <input type="number" id="slot${slotCount}_height" name="height[]"><br>
        <label for="slot${slotCount}_price">Price:</label><br>
        <input type="number" id="slot${slotCount}_price" name="price[]"><br>
        <label for="slot${slotCount}_specifications">Specifications:</label><br>
        <input type="text" id="slot${slotCount}_specifications" name="specifications[]"><br><br>
    `;
    
    slotFields.appendChild(newSlotDiv);
});