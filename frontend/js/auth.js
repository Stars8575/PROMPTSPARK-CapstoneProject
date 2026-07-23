const API_URL = `${API_BASE}/auth`;

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (res.ok) {
        message.textContent = '✅ Registered! Redirecting to login...';
        setTimeout(() => window.location.href = 'login.html', 1000);
      } else {
        message.textContent = '❌ ' + data.message;
      }
    } catch (err) {
      message.textContent = '❌ Could not reach server';
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
        window.location.href = 'dashboard.html';
      } else {
        message.textContent = '❌ ' + data.message;
      }
    } catch (err) {
      message.textContent = '❌ Could not reach server';
    }
  });
}