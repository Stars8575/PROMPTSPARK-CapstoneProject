const statusText = document.getElementById('statusText');

fetch('http://localhost:5000/api/test')
  .then(response => response.json())
  .then(data => {
    statusText.textContent = '✅ ' + data.message;
  })
  .catch(error => {
    statusText.textContent = '❌ Could not reach backend';
    console.error(error);
  });