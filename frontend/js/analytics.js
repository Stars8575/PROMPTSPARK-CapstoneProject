const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  window.location.href = 'login.html';
});

async function loadAnalytics() {
  try {
    const res = await fetch('http://localhost:5000/api/analytics/summary', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    document.getElementById('statRuns').textContent = data.totals.totalRuns;
    document.getElementById('statTokens').textContent = data.totals.totalTokens.toLocaleString();
    document.getElementById('statCost').textContent = `$${data.totals.totalCost.toFixed(4)}`;

    // Cost by day chart
    new Chart(document.getElementById('costChart'), {
      type: 'bar',
      data: {
        labels: data.costByDay.map(d => d.date),
        datasets: [{
          label: 'Cost (USD)',
          data: data.costByDay.map(d => d.cost),
          backgroundColor: '#8B5CB4'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });

    // Tokens by model chart
    new Chart(document.getElementById('modelChart'), {
      type: 'doughnut',
      data: {
        labels: data.tokensByModel.map(m => m.model),
        datasets: [{
          data: data.tokensByModel.map(m => m.tokens),
          backgroundColor: ['#5B3A8C', '#8B5CB4', '#B48CD6', '#D6BEEB', '#E4D6F2']
        }]
      },
      options: { responsive: true }
    });
  } catch (err) {
    console.error(err);
  }
}

loadAnalytics();