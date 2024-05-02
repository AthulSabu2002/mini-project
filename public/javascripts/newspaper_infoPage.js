const boxes = document.querySelectorAll('.box');

boxes.forEach(box => {
    box.addEventListener('click', () => {
        box.classList.toggle('open');
    });
});

const pathname = window.location.pathname;
        console.log(pathname);
        const layoutName = pathname.split('/').pop();
        const currentDate = new Date();
        console.log("Current Date:", currentDate);

        const year = currentDate.getFullYear().toString();
        let month = (currentDate.getMonth() + 1).toString();
        let day = currentDate.getDate().toString();

        if (month.length === 1) {
            month = '0' + month;
        }
        if (day.length === 1) {
            day = '0' + day;
        }

        const publishingDate = year + month + day;
        console.log("Publishing Date (YYYYMMDD):", publishingDate);
        function handleButtonClick() {
            const redirectUrl = `/users/viewSlot/${layoutName}/${publishingDate}`;

            window.location.href = redirectUrl;
        }

        document.getElementById("myButton").addEventListener("click", handleButtonClick);