const SUPABASE_URL = 'https://api.iizr.app';
const REST_BASE = `${SUPABASE_URL}/rest/v1`;
const AUTH_URL = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cXlqbW13eXpkYXh0c2x1dG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MzU5NzEsImV4cCI6MjA2ODAxMTk3MX0.Oqdcgm7pqN4fWa6811cBn6afaIUH4QBSYp23oEx7bSY';

const form = document.getElementById('fetch-form');
const output = document.getElementById('output');
const results = document.getElementById('results');
const aiForm = document.getElementById('ai-form');
const aiOutput = document.getElementById('ai-output');
const aiQueryButton = document.getElementById('ai-query-button');

let methodologyText = '';
let projectInfoText = '';

async function loadMethodology() {
  try {
    const response = await fetch('methodology.md');
    methodologyText = await response.text();
  } catch (error) {
    methodologyText = 'Methodology unavailable.';
  }
}

function setAiButtonEnabled(isEnabled) {
  aiQueryButton.disabled = !isEnabled;
  aiQueryButton.classList.toggle('is-disabled', !isEnabled);
}

loadMethodology();

function buildRestUrl(table, params) {
  const url = new URL(`${REST_BASE}/${table}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

async function fetchJson(url, options, { optional = false } = {}) {
  const response = await fetch(url, options);
  const text = await response.text();

  if (!response.ok) {
    const message = `Request failed (${response.status}) for ${url}: ${text.slice(0, 500)}`;
    if (optional) {
      return { error: message, url };
    }
    throw new Error(message);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    const message = `Invalid JSON response for ${url}`;
    if (optional) {
      return { error: message, url };
    }
    throw new Error(message);
  }
}

async function login(email, password) {
  const body = {
    email,
    password,
    gotrue_meta_security: {},
  };

  const response = await fetchJson(AUTH_URL, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      authorization: `Bearer ${ANON_KEY}`,
      'content-type': 'application/json;charset=UTF-8',
      accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  return response.access_token;
}

function authHeaders(accessToken) {
  return {
    apikey: ANON_KEY,
    authorization: `Bearer ${accessToken}`,
    accept: 'application/json',
  };
}

async function fetchProjectData(projectId, headers) {
  const projectUrl = buildRestUrl('projects', {
    select: '*',
    id: `eq.${projectId}`,
  });

  const updatesUrl = buildRestUrl('project_updates', {
    select: '*',
    project_id: `eq.${projectId}`,
    order: 'created_at.desc',
  });

  const reactionsUrl = buildRestUrl('project_reactions', {
    select: '*',
    project_id: `eq.${projectId}`,
  });

  const faqsUrl = buildRestUrl('project_faqs', {
    select: '*',
    project_id: `eq.${projectId}`,
    order: 'display_order.asc',
  });

  const adminAssignmentsUrl = buildRestUrl('admin_project_assignments', {
    select: 'id,user_id,project_id',
    project_id: `eq.${projectId}`,
  });

  const project = await fetchJson(projectUrl, { headers });
  const projectUpdates = await fetchJson(updatesUrl, { headers });
  const projectReactions = await fetchJson(reactionsUrl, { headers });
  const projectFaqs = await fetchJson(faqsUrl, { headers }, { optional: true });
  const adminAssignments = await fetchJson(adminAssignmentsUrl, { headers }, { optional: true });

  let updateReactions = [];
  const updateIds = Array.isArray(projectUpdates)
    ? projectUpdates.map(update => update.id).filter(Boolean)
    : [];

  if (updateIds.length > 0) {
    const updateReactionsUrl = buildRestUrl('update_reactions', {
      select: '*',
      update_id: `in.(${updateIds.join(',')})`,
    });
    updateReactions = await fetchJson(updateReactionsUrl, { headers }, { optional: true });
  }

  let profiles = [];
  const adminUserIds = Array.isArray(adminAssignments)
    ? adminAssignments.map(row => row.user_id).filter(Boolean)
    : [];

  if (adminUserIds.length > 0) {
    const profilesUrl = buildRestUrl('profiles', {
      select: 'display_name,email,avatar_url',
      user_id: `in.(${adminUserIds.join(',')})`,
    });
    profiles = await fetchJson(profilesUrl, { headers }, { optional: true });
  }

  return {
    project,
    project_updates: projectUpdates,
    project_reactions: projectReactions,
    project_faqs: projectFaqs,
    admin_project_assignments: adminAssignments,
    update_reactions: updateReactions,
    profiles,
    fetched_at: new Date().toISOString(),
  };
}

form.addEventListener('submit', async event => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const projectId = document.getElementById('project-id').value.trim();

  output.textContent = 'Fetching...';
  results.open = true;

  try {
    const accessToken = await login(email, password);
    const headers = authHeaders(accessToken);
    const data = await fetchProjectData(projectId, headers);
    output.textContent = JSON.stringify(data, null, 2);
    projectInfoText = output.textContent;
    setAiButtonEnabled(true);
  } catch (error) {
    output.textContent = error.message || String(error);
    projectInfoText = '';
    setAiButtonEnabled(false);
  }
});

aiForm.addEventListener('submit', async event => {
  event.preventDefault();

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
  results.open = true;

  const combinedQuery = `${methodologyText}\n\nProject Information:\n${projectInfoText}`;

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
        max_tokens: maxTokens,
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
    aiOutput.textContent = content;
  } catch (error) {
    aiOutput.textContent = error.message || String(error);
  }
});
