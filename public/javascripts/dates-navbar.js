function populateNavbar() {
  const currentDate = new Date();
  const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  for (let i = 0; i < 7; i++) {
    const currentDayDate = new Date(currentDate);
    currentDayDate.setDate(currentDate.getDate() + i + 1);

    const dayLine = currentDayDate.toLocaleString('default', { weekday: 'short' });
    const dateLine = currentDayDate.getDate();
    const monthLine = currentDayDate.toLocaleString('default', { month: 'short' });

    const column = document.getElementById(daysOfWeek[i]);
    column.querySelector('.day-line').textContent = dayLine;
    column.querySelector('.date-line').textContent = dateLine;
    column.querySelector('.month-line').textContent = monthLine;

    column.addEventListener('click', () => {
      // Remove the "selected" class from all columns
      const columns = document.querySelectorAll('.navbar-column');
      columns.forEach(col => col.classList.remove('selected'));

      // Add the "selected" class to the clicked column
      column.classList.add('selected');

      const selectedDetails = {
        day: dayLine,
        date: dateLine,
        month: monthLine
      };

      sendSelectedDetails(selectedDetails, column);
    });
  }
}

async function sendSelectedDetails(selectedDetails, selectedColumn) {
  const urlPath = window.location.pathname;

  const pathParts = urlPath.split('/');

  const newspaperName = pathParts[pathParts.length - 2];
  try {
    const response = await fetch(`/users/viewSlot/${newspaperName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedDetails)
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      const layoutName = responseData.layoutName;
      const publishingDateRes = responseData.publishingDate.split('T')[0];
      const publishingDate = publishingDateRes.replace(/-/g, '');
      const url = `/users/viewSlot/${layoutName}/${publishingDate}`;

      sessionStorage.setItem('selectedColumn', selectedColumn.id);

      window.location.href = url;
    } else {
      console.error('Failed to send selected details to the server.');
      selectedColumn.classList.add('selected');
    }
  } catch (error) {
    console.error('Error occurred while sending selected details:', error);
    selectedColumn.classList.add('selected');
  }
}

window.addEventListener('load', () => {
  const selectedColumnId = sessionStorage.getItem('selectedColumn');
  if (selectedColumnId) {
    const selectedColumn = document.getElementById(selectedColumnId);
    if (selectedColumn) {
      selectedColumn.classList.add('selected');
    }
    sessionStorage.removeItem('selectedColumn');
  }
});

document.addEventListener('DOMContentLoaded', populateNavbar);