const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const API_URL = 'http://localhost:5000/api/prompts';
const form = document.getElementById('promptForm');
const message = document.getElementById('message');
const deleteBtn = document.getElementById('deleteBtn');
const playgroundBtn = document.getElementById('playgroundBtn');
const editorTitle = document.getElementById('editorTitle');
const versionsCard = document.getElementById('versionsCard');
const versionsList = document.getElementById('versionsList');

const urlParams = new URLSearchParams(window.location.search);
const promptId = urlParams.get('id');

if (promptId) {
  editorTitle.textContent = 'Edit Prompt';
  deleteBtn.style.display = 'inline-block';
  playgroundBtn.style.display = 'inline-block';
  versionsCard.style.display = 'block';
  document.getElementById('promptId').value = promptId;

  fetch(`${API_URL}/${promptId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(prompt => {
      document.getElementById('title').value = prompt.title;
      document.getElementById('category').value = prompt.category;
      document.getElementById('content').value = prompt.content;
    });

  loadVersions();
}

async function loadVersions() {
  try {
    const res = await fetch(`${API_URL}/${promptId}/versions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const versions = await res.json();

    if (versions.length === 0) {
      versionsList.innerHTML = '<p>No previous versions yet. Save a change to create one.</p>';
      return;
    }

    versionsList.innerHTML = '';
    versions.forEach(v => {
      const item = document.createElement('div');
      item.className = 'version-item';
      item.innerHTML = `
        <div>
          <strong>Version ${v.versionNumber}</strong>
          <p>${v.title}</p>
        </div>
        <button class="btn-outline restore-btn" data-id="${v._id}">Restore</button>
      `;
      versionsList.appendChild(item);
    });

    document.querySelectorAll('.restore-btn').forEach(btn => {
      btn.addEventListener('click', () => restoreVersion(btn.dataset.id));
    });
  } catch (err) {
    console.error(err);
  }
}

async function restoreVersion(versionId) {
  if (!confirm('Restore this version? Your current content will be saved as a new version first.')) return;

  try {
    const res = await fetch(`${API_URL}/${promptId}/restore/${versionId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const prompt = await res.json();

    if (res.ok) {
      document.getElementById('title').value = prompt.title;
      document.getElementById('category').value = prompt.category;
      document.getElementById('content').value = prompt.content;
      loadVersions();
      message.textContent = '✅ Version restored';
    }
  } catch (err) {
    message.textContent = '❌ Could not restore version';
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const body = {
    title: document.getElementById('title').value,
    category: document.getElementById('category').value,
    content: document.getElementById('content').value
  };

  const isEditing = !!promptId;
  const url = isEditing ? `${API_URL}/${promptId}` : API_URL;
  const method = isEditing ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      if (isEditing) {
        message.textContent = '✅ Saved';
        loadVersions();
      } else {
        window.location.href = 'prompts.html';
      }
    } else {
      const data = await res.json();
      message.textContent = '❌ ' + data.message;
    }
  } catch (err) {
    message.textContent = '❌ Could not reach server';
  }
});

deleteBtn.addEventListener('click', async () => {
  if (!confirm('Delete this prompt? This cannot be undone.')) return;

  try {
    const res = await fetch(`${API_URL}/${promptId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      window.location.href = 'prompts.html';
    }
  } catch (err) {
    message.textContent = '❌ Could not delete prompt';
  }
});

playgroundBtn.addEventListener('click', () => {
  window.location.href = `playground.html?id=${promptId}`;
});