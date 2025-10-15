function createTripChart(data) {
    // Sort by date
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const canvas = document.createElement('canvas');
    document.getElementById('trip-chart').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line', // was 'scatter'
        data: {
            datasets: [{
                label: 'Trip Reports',
                data: data.map(trip => ({
                    x: new Date(trip.date),
                    y: trip.elevation,
                    url: trip.url,
                    peak: trip.peak
                })),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            onClick: (e, activeElements) => {
                if (activeElements.length > 0) {
                    const index = activeElements[0].index;
                    window.location.href = data[index].url;
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month'
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Elevation (feet)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false  // Removing clickable legend because i only have one for now
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const trip = data[context.dataIndex];
                            return `${trip.peak}: ${trip.elevation} ft`;
                        }
                    }
                }
            }
        }
    });
}