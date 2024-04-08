function populateNavbar() {
    const currentDate = new Date();
    const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    for (let i = 0; i < 7; i++) {
        const currentDayDate = new Date(currentDate);
        currentDayDate.setDate(currentDate.getDate() + i);

        const dayLine = currentDayDate.toLocaleString('default', { weekday: 'short' });
        const dateLine = currentDayDate.getDate();
        const monthLine = currentDayDate.toLocaleString('default', { month: 'short' });

        const column = document.getElementById(daysOfWeek[i]);
        column.querySelector('.day-line').textContent = dayLine;
        column.querySelector('.date-line').textContent = dateLine;
        column.querySelector('.month-line').textContent = monthLine;

        column.addEventListener('click', () => {
            const selectedDetails = {
                day: dayLine,
                date: dateLine,
                month: monthLine
            };

            sendSelectedDetails(selectedDetails);
        });
    }
}

async function sendSelectedDetails(selectedDetails) {
    try {
        const response = await fetch('/users/viewSlot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedDetails)
        });

        if (response.ok) {
            const responseData = await response.json();
            const layoutName = responseData.layoutName;
            let publishingDate = responseData.publishingDate.split('T')[0]; 
            publishingDate = publishingDate.replace(/-/g, ''); 

            const url = `/users/viewSlot/${layoutName}/${publishingDate}`;

            window.location.href = url;
        } else {
            console.error('Failed to send selected details to the server.');
        }
    } catch (error) {
        console.error('Error occurred while sending selected details:', error);
    }
}


document.addEventListener('DOMContentLoaded', populateNavbar);