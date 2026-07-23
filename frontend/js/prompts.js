const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  window.location.href = 'login.html';
});

const API_URL = 'http://localhost:5000/api/prompts';
const promptGrid = document.getElementById('promptGrid');
const emptyMessage = document.getElementById('emptyMessage');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

async function loadPrompts() {
  const search = searchInput.value.trim();
  const category = categoryFilter.value;

  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);

  try {
    const res = await fetch(`${API_URL}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const prompts = await res.json();
    renderPrompts(prompts);
  } catch (err) {
    console.error(err);
  }
}

function renderPrompts(prompts) {
  promptGrid.innerHTML = '';

  if (prompts.length === 0) {
    emptyMessage.style.display = 'block';
    return;
  }
  emptyMessage.style.display = 'none';

  prompts.forEach(prompt => {
    const card = document.createElement('div');
    card.className = 'prompt-card';
    card.innerHTML = `
      <span class="tag">${prompt.category}</span>
      <h4>${prompt.title}</h4>
      <p>${prompt.content}</p>
    `;
    card.addEventListener('click', () => {
      window.location.href = `editor.html?id=${prompt._id}`;
    });
    promptGrid.appendChild(card);
  });
}

let debounceTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(loadPrompts, 300);
});

categoryFilter.addEventListener('change', loadPrompts);

loadPrompts();