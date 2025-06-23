export function createBarChart(canvasId, label, labels, data, backgroundColor, borderColor) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: backgroundColor || 'rgba(0, 245, 212, 0.2)',
                borderColor: borderColor || 'rgba(0, 245, 212, 1)',
                borderWidth: 1,
                borderRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#a0aec0' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#a0aec0' }
                }
            }
        }
    });
}

export function createLineChart(canvasId, label, labels, data, backgroundColor, borderColor) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                fill: true,
                backgroundColor: backgroundColor || 'rgba(0, 245, 212, 0.1)',
                borderColor: borderColor || 'rgba(0, 245, 212, 1)',
                tension: 0.3,
                pointBackgroundColor: 'rgba(0, 245, 212, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#a0aec0' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#a0aec0' }
                }
            }
        }
    });
}
