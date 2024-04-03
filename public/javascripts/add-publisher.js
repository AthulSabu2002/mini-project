document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('submit').addEventListener('click', function(event) {
        event.preventDefault(); 
        console.log('saving publisher');
        
    
        const publisherData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            newspaperName: document.getElementById('newspaperName').value
        };
        
        sendPublisherData(publisherData);
    });
    
    function sendPublisherData(publisherData) {
    
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/admin/add-publisher', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    alert('Publisher saved successfully!');
                    window.location.href = '/admin/view-requests';
                } else {
                    alert('Failed to save publisher!');
                    console.error('Failed to save publisher:', xhr.responseText);
                }
            }
        };
        xhr.send(JSON.stringify(publisherData));
    }
    
    });
    