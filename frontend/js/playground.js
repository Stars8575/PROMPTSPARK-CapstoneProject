const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const API_URL = 'http://localhost:5000/api';
const promptContent = document.getElementById('promptContent');
const runBtn = document.getElementById('runBtn');
const runStatus = document.getElementById('runStatus');
const output = document.getElementById('output');
const usageBox = document.getElementById('usageBox');

// If we arrived from the editor with a prompt ID, load its content
const urlParams = new URLSearchParams(window.location.search);
const promptId = urlParams.get('id');

if (promptId) {
  fetch(`${API_URL}/prompts/${promptId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(prompt => {
      promptContent.value = prompt.content;
    });
}

runBtn.addEventListener('click', async () => {
  const content = promptContent.value.trim();
  if (!content) {
    runStatus.textContent = '❌ Enter a prompt first';
    return;
  }

  runBtn.disabled = true;
  runStatus.textContent = 'Running...';
  output.textContent = '';
  usageBox.textContent = '';

  try {
    const res = await fetch(`${API_URL}/ai/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content, provider: 'groq' })
    });

    const data = await res.json();

    if (res.ok) {
      output.textContent = data.output;
      usageBox.textContent = `Model: ${data.model} · Prompt tokens: ${data.usage.promptTokens} · Completion tokens: ${data.usage.completionTokens} · Total: ${data.usage.totalTokens}`;
      runStatus.textContent = '✅ Done';
    } else {
      runStatus.textContent = '❌ ' + data.message;
    }
  } catch (err) {
    runStatus.textContent = '❌ Could not reach server';
  } finally {
    runBtn.disabled = false;
  }
});