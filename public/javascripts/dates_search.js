document.getElementById("searchForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var destination = document.getElementById("destination").value;
    var datepicker = document.getElementById("datepicker").value;
    if (destination === "" || datepicker === "") {
        alert("Please select both destination and date");
        event.preventDefault();
    }
    var date = document.getElementById("datepicker").value;
    var dateParts = date.split("/");
    var dateParts = date.split("-");
    var formattedDate = dateParts[2] + dateParts[1].padStart(2, "0") + dateParts[0].padStart(2, "0");

    var link = `/users/viewSlot/${destination}/${formattedDate}`;
    console.log(link);

    document.cookie = "returnTo=" + encodeURIComponent(link);

    window.location.href = link;
});