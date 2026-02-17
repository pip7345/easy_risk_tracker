let methodologyText = '';
let currentQuery = '';

const MAX_AI_OUTPUT_CHARS = 12000;

function truncateText(text, maxChars) {
  if (!text || text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}\n\n[Truncated ${text.length - maxChars} characters]`;
}

async function loadMethodology() {
  if (window.METHODOLOGY_TEXT) {
    methodologyText = window.METHODOLOGY_TEXT;
    return;
  }
  methodologyText = 'Methodology unavailable.';
}

loadMethodology();

async function buildQueryFromProjectInfo(projectInfoText) {
  if (!methodologyText || methodologyText === 'Methodology unavailable.') {
    await loadMethodology();
  }

  if (!projectInfoText || !methodologyText || methodologyText === 'Methodology unavailable.') {
    const warning = '[Methodology could not be loaded. Serve this page over a local web server so methodology.js is accessible.]';
    currentQuery = `BEGIN METHODOLOGY\n${warning}\nEND METHODOLOGY\n\nBEGIN PROJECT INFORMATION\n${projectInfoText || '[Project information missing]'}\nEND PROJECT INFORMATION`;
    return false;
  }

  currentQuery = `BEGIN METHODOLOGY\n${methodologyText}\nEND METHODOLOGY\n\nBEGIN PROJECT INFORMATION\n${projectInfoText}\nEND PROJECT INFORMATION`;
  return true;
}

async function buildQuery(projectInfoText) {
  const isBuilt = await buildQueryFromProjectInfo(projectInfoText || '');
  return { isBuilt, query: currentQuery };
}

async function runAiQuery({ apiUrl, apiKey, model, temperature, maxTokens, projectInfoText }) {
  const { isBuilt, query } = await buildQuery(projectInfoText);
  if (!isBuilt) {
    return { error: 'Methodology could not be loaded. Serve this page over a local web server so methodology.js is accessible.', query };
  }

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
        { role: 'user', content: query },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { error: errorText || `Request failed: ${response.status}`, query };
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2);
  return { content: truncateText(content, MAX_AI_OUTPUT_CHARS), query };
}

window.aiQueryApi = {
  buildQuery,
  runAiQuery,
};
