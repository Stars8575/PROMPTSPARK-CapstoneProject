const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  window.location.href = 'login.html';
});

const API_URL = 'http://localhost:5000/api/ai/compare';
const runBtn = document.getElementById('runCompareBtn');
const status = document.getElementById('compareStatus');

function renderResult(prefix, result) {
  document.getElementById(`output${prefix}`).textContent = result.output;
  document.getElementById(`usage${prefix}`).textContent =
    `Model: ${result.model} · Tokens: ${result.usage.totalTokens} · Cost: $${result.costUsd.toFixed(6)}`;
}

runBtn.addEventListener('click', async () => {
  const contentA = document.getElementById('variantA').value.trim();
  const contentB = document.getElementById('variantB').value.trim();

  if (!contentA || !contentB) {
    status.textContent = '❌ Fill in both variants first';
    return;
  }

  runBtn.disabled = true;
  status.textContent = 'Running both variants...';

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ contentA, contentB, provider: 'groq' })
    });

    const data = await res.json();

    if (res.ok) {
      renderResult('A', data.variantA);
      renderResult('B', data.variantB);
      status.textContent = '✅ Comparison complete';
    } else {
      status.textContent = '❌ ' + data.message;
    }
  } catch (err) {
    status.textContent = '❌ Could not reach server';
  } finally {
    runBtn.disabled = false;
  }
});