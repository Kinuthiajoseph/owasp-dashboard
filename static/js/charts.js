

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the dashboard page with chart elements
    if (document.getElementById('riskChart') && document.getElementById('prevalenceChart')) {
        createCharts();
    }
});

function createCharts() {
    createRiskDistributionChart();
    createPrevalenceChart();
}

function createRiskDistributionChart() {
    // Count vulnerabilities by risk level
    const riskLevels = {};
    
    vulnerabilities.forEach(vuln => {
        if (!riskLevels[vuln.risk_level]) {
            riskLevels[vuln.risk_level] = 0;
        }
        riskLevels[vuln.risk_level]++;
    });
    
    // Prepare data for the chart
    const labels = Object.keys(riskLevels);
    const data = Object.values(riskLevels);
    const colors = labels.map(level => {
        switch(level) {
            case 'Critical': return '#dc3545';
            case 'High': return '#fd7e14';
            case 'Medium': return '#ffc107';
            case 'Low': return '#20c997';
            default: return '#6c757d';
        }
    });
    
    // Create the chart
    const ctx = document.getElementById('riskChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

function createPrevalenceChart() {
    // Sort vulnerabilities by prevalence (descending)
    const sortedVulns = [...vulnerabilities].sort((a, b) => b.prevalence - a.prevalence);
    
    // Prepare data for the chart
    const labels = sortedVulns.map(vuln => vuln.id);
    const data = sortedVulns.map(vuln => vuln.prevalence);
    const colors = sortedVulns.map(vuln => {
        switch(vuln.risk_level) {
            case 'Critical': return '#dc3545';
            case 'High': return '#fd7e14';
            case 'Medium': return '#ffc107';
            case 'Low': return '#20c997';
            default: return '#6c757d';
        }
    });
    
    // Create the chart
    const ctx = document.getElementById('prevalenceChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Prevalence (%)',
                data: data,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Prevalence (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'OWASP Category'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}
