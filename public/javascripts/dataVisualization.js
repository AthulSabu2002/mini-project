const newBookingsCount = document.querySelectorAll('.booking_card.new').length;
const cancelledBookingsCount = document.querySelectorAll('.booking_card.cancelled').length;

const boxInfoList = document.querySelector('.box-info');

const bookingItem = boxInfoList.querySelector('li:nth-child(1)');
const userItem = boxInfoList.querySelector('li:nth-child(2)');
const revenueItem = boxInfoList.querySelector('li:nth-child(3)');

const bookingsCount = parseInt(bookingItem.querySelector('h3').textContent);
const userCount = parseInt(userItem.querySelector('h3').textContent);
const totalRevenue = parseInt(revenueItem.querySelector('h3').textContent);

const bookingsData = {
    newBookings: newBookingsCount,
    cancelledBookings: cancelledBookingsCount
};


const ctx = document.getElementById('bookingsChart').getContext('2d');
const bookingsChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['New Bookings', 'Cancelled Bookings'],
        datasets: [{
            data: [bookingsData.newBookings, bookingsData.cancelledBookings],
            backgroundColor: [
                'rgba(40, 167, 69, 0.8)',
                'rgba(220, 53, 69, 0.8)'
            ],
            borderColor: [
                'rgba(40, 167, 69, 1)',
                'rgba(220, 53, 69, 1)'
            ],
            borderWidth: 2,
            hoverBorderWidth: 4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Today's Overview",
                font: {
                    size: 20,
                    family: 'Montserrat, sans-serif',
                    weight: 'bold'
                }
            },
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 15,
                    padding: 20,
                    font: {
                        size: 14,
                        family: 'Montserrat, sans-serif'
                    }
                }
            }
        }
    }
});


var cty = document.getElementById('myOverviewChart').getContext('2d');
var overview = new Chart(cty, {
    type: 'bar',
    data: {
        labels: ['Bookings', 'Users', 'Revenue'],
        datasets: [{
            label: 'Data Overview',
            data: [bookingsCount, userCount, totalRevenue],
            backgroundColor: [
                'rgba(40, 167, 69, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 193, 7, 0.8)'
            ],
            borderColor: [
                'rgba(40, 167, 69, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 193, 7, 1)'
            ],
            borderWidth: 2,
            borderSkipped: false,
            borderRadius: 10,
            barPercentage: 0.7,
            categoryPercentage: 0.5
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Advanced Data Visualization',
                font: {
                    size: 16,
                    family: 'Montserrat, sans-serif',
                    weight: 'bold'
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            },
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    padding: 10,
                    font: {
                        size: 12,
                        family: 'Montserrat, sans-serif'
                    }
                }
            }
        },
        interaction: {
            mode: 'nearest',
            intersect: false
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Category',
                    font: {
                        size: 16,
                        family: 'Montserrat, sans-serif',
                        weight: 'bold'
                    }
                },
                gridLines: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    borderDash: [5, 5],
                    borderDashOffset: 2
                },
                ticks: {
                    font: {
                        size: 12,
                        family: 'Montserrat, sans-serif'
                    }
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Value',
                    font: {
                        size: 16,
                        family: 'Montserrat, sans-serif',
                        weight: 'bold'
                    }
                },
                suggestedMin: 0,
                suggestedMax: Math.max(bookingsCount, userCount, totalRevenue) * 1.1,
                gridLines: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    borderDash: [5, 5],
                    borderDashOffset: 2
                },
                ticks: {
                    font: {
                        size: 12,
                        family: 'Montserrat, sans-serif'
                    }
                }
            }
        }
    }
});