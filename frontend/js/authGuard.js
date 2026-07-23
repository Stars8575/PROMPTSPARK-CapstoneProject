// Wrap fetch so any 401 anywhere in the app auto-redirects to login
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (response.status === 401 && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
  }
  return response;
};