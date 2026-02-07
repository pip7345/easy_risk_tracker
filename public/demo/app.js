const fetchForm = document.getElementById('fetch-form');
const fetchPanel = document.getElementById('fetch-panel');
const output = document.getElementById('output');

const aiForm = document.getElementById('ai-form');
const aiPanel = document.getElementById('ai-panel');
const aiOutput = document.getElementById('ai-output');
const aiQueryButton = document.getElementById('ai-query-button');
const queryPreview = document.getElementById('query-preview');

function setAiButtonEnabled(isEnabled) {
  aiQueryButton.disabled = !isEnabled;
  aiQueryButton.classList.toggle('is-disabled', !isEnabled);
}

function updateProjectInfo(text) {
  window.projectInfoText = text;
  window.dispatchEvent(
    new CustomEvent('projectInfoUpdated', {
      detail: { hasData: Boolean(text) },
    })
  );
}

setAiButtonEnabled(false);

window.addEventListener('projectInfoUpdated', async event => {
  const hasData = Boolean(event.detail?.hasData);
  if (hasData && window.aiQueryApi?.buildQuery) {
    const { query } = await window.aiQueryApi.buildQuery(window.projectInfoText);
    queryPreview.textContent = query || 'Query preview will appear here after fetching the project.';
  }
  setAiButtonEnabled(hasData);
});

fetchForm.addEventListener('submit', async event => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const projectId = document.getElementById('project-id').value.trim();

  output.textContent = 'Fetching...';
  fetchPanel.open = true;

  try {
    const pretty = await window.projectFetchApi.fetchProjectInfo({ email, password, projectId });
    output.textContent = pretty;
    updateProjectInfo(pretty);
  } catch (error) {
    output.textContent = error.message || String(error);
    updateProjectInfo('');
  }
});

aiForm.addEventListener('submit', async event => {
  event.preventDefault();

  const projectInfoText = window.projectInfoText || '';
  if (!projectInfoText) {
    setAiButtonEnabled(false);
    aiOutput.textContent = 'Project information is required before running an AI query.';
    return;
  }

  const apiUrl = document.getElementById('api-url').value.trim();
  const apiKey = document.getElementById('api-key').value.trim();
  const model = document.getElementById('model').value.trim();
  const temperature = Number(document.getElementById('temperature').value) || 0;
  const maxTokens = Number(document.getElementById('max-tokens').value) || 1200;

  aiOutput.textContent = 'Querying...';
  aiPanel.open = true;

  const { content, error } = await window.aiQueryApi.runAiQuery({
    apiUrl,
    apiKey,
    model,
    temperature,
    maxTokens,
    projectInfoText,
  });

  if (error) {
    aiOutput.textContent = error;
    return;
  }

  aiOutput.textContent = content;
});
