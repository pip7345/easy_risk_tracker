const aiForm = document.getElementById('ai-form');
const aiOutput = document.getElementById('ai-output');
const aiQueryButton = document.getElementById('ai-query-button');
const aiPanel = document.getElementById('ai-panel');
const queryPreview = document.getElementById('query-preview');

let methodologyText = '';
let currentQuery = '';

const MAX_AI_OUTPUT_CHARS = 12000;

function truncateText(text, maxChars) {
  if (!text || text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}\n\n[Truncated ${text.length - maxChars} characters]`;
}

function setAiButtonEnabled(isEnabled) {
  aiQueryButton.disabled = !isEnabled;
  aiQueryButton.classList.toggle('is-disabled', !isEnabled);
}

window.setAiButtonEnabled = setAiButtonEnabled;
setAiButtonEnabled(false);

async function loadMethodology() {
  try {
    const response = await fetch('methodology.md');
    if (!response.ok) {
      throw new Error(`Failed to load methodology.md (${response.status})`);
    }
    methodologyText = await response.text();
  } catch (error) {
    methodologyText = 'Methodology unavailable.';
  }
}

loadMethodology();

async function buildQueryFromProjectInfo() {
  if (!methodologyText || methodologyText === 'Methodology unavailable.') {
    await loadMethodology();
  }

  const projectInfoText = window.projectInfoText || '';
  if (!projectInfoText || !methodologyText || methodologyText === 'Methodology unavailable.') {
    const warning = '[Methodology could not be loaded. Serve this page over a local web server so methodology.md is accessible.]';
    currentQuery = `BEGIN METHODOLOGY\n${warning}\nEND METHODOLOGY\n\nBEGIN PROJECT INFORMATION\n${projectInfoText || '[Project information missing]'}\nEND PROJECT INFORMATION`;
    queryPreview.textContent = currentQuery;
    return false;
  }

  currentQuery = `BEGIN METHODOLOGY\n${methodologyText}\nEND METHODOLOGY\n\nBEGIN PROJECT INFORMATION\n${projectInfoText}\nEND PROJECT INFORMATION`;
  queryPreview.textContent = currentQuery;
  return true;
}

window.addEventListener('projectInfoUpdated', async event => {
  const hasData = Boolean(event.detail?.hasData);
  if (hasData) {
    await buildQueryFromProjectInfo();
  }
  setAiButtonEnabled(hasData);
});

aiForm.addEventListener('submit', async event => {
  event.preventDefault();

  const projectInfoText = window.projectInfoText || '';
  if (!projectInfoText) {
    setAiButtonEnabled(false);
    aiOutput.textContent = 'Project information is required before running an AI query.';
    return;
  }

  const isBuilt = await buildQueryFromProjectInfo();
  if (!isBuilt) {
    aiOutput.textContent = 'Methodology could not be loaded. Serve this page over a local web server so methodology.md is accessible.';
    return;
  }

  const apiUrl = document.getElementById('api-url').value.trim();
  const apiKey = document.getElementById('api-key').value.trim();
  const model = document.getElementById('model').value.trim();
  const temperature = Number(document.getElementById('temperature').value) || 0;
  const maxTokens = Number(document.getElementById('max-tokens').value) || 1200;

  aiOutput.textContent = 'Querying...';
  aiPanel.open = true;

  const combinedQuery = currentQuery;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        max_completion_tokens: maxTokens,
        messages: [
          { role: 'system', content: 'You are a cryptocurrency analyst.' },
          { role: 'user', content: combinedQuery },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2);
    aiOutput.textContent = truncateText(content, MAX_AI_OUTPUT_CHARS);
  } catch (error) {
    aiOutput.textContent = error.message || String(error);
  }
});
