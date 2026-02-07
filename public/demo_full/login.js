const form = document.getElementById('login-form');
const statusEl = document.getElementById('status');
const loginButton = document.getElementById('login-button');
const sampleButton = document.getElementById('sample-button');

function setStatus(message, visible = true) {
  statusEl.textContent = message;
  statusEl.hidden = !visible;
}

function setLoading(isLoading) {
  loginButton.disabled = isLoading;
  sampleButton.disabled = isLoading;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setLoading(true);
  setStatus('Signing in and preparing your project view...');

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const projectId = document.getElementById('project-id').value.trim();

  try {
    const payload = { email, password, projectId };
    sessionStorage.setItem('demoFullCredentials', JSON.stringify(payload));
    sessionStorage.removeItem('demoFullSample');
    window.location.href = 'render.html';
  } catch (error) {
    setStatus(`Login failed: ${error.message}`);
  } finally {
    setLoading(false);
  }
});

sampleButton.addEventListener('click', () => {
  sessionStorage.removeItem('demoFullCredentials');
  sessionStorage.setItem('demoFullSample', '1');
  window.location.href = 'render.html?sample=1';
});
