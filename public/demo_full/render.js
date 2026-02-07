const banner = document.getElementById('banner');
const heroTitle = document.getElementById('hero-title');
const heroDescription = document.getElementById('hero-description');
const heroLogo = document.getElementById('hero-logo');
const tagList = document.getElementById('tag-list');
const socialLinks = document.getElementById('social-links');
const updateCount = document.getElementById('update-count');
const reactionCount = document.getElementById('reaction-count');
const lastUpdated = document.getElementById('last-updated');
const updatesList = document.getElementById('updates-list');
const projectName = document.getElementById('project-name');
const websiteLink = document.getElementById('website-link');
const joinLink = document.getElementById('join-link');
const userEmail = document.getElementById('user-email');
const aiRunButton = document.getElementById('ai-run');
const aiRunSection = document.getElementById('ai-run-section');
const aiResults = document.getElementById('ai-results') || document.getElementById('ai-action');

const SAMPLE_URL = 'output3.json';
const SAMPLE_ASSESSMENT_URL = 'output2.json';
const AI_CONFIG = {
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-5.2',
  temperature: 0.2,
  maxTokens: 1800,
};

let projectInfoText = '';

function setAiSectionMode(mode) {
  if (!aiRunSection || !aiResults) return;
  const showResults = mode === 'results';
  aiRunSection.hidden = showResults;
  aiResults.hidden = !showResults;
}

function showBanner(message) {
  banner.textContent = message;
  banner.hidden = false;
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function getPrimaryProject(data) {
  if (!data) return null;
  if (Array.isArray(data.project)) return data.project[0] || null;
  return data.project || null;
}

function renderTags(tags) {
  tagList.innerHTML = '';
  normalizeArray(tags).forEach(tag => {
    const el = document.createElement('span');
    el.className = 'tag';
    el.textContent = tag;
    tagList.appendChild(el);
  });
}

function renderSocialLinks(project) {
  socialLinks.innerHTML = '';
  const links = [
    { label: 'Website', url: project.website_url },
    { label: 'Twitter', url: project.twitter_url },
    { label: 'Telegram', url: project.telegram_url },
    { label: 'GitHub', url: project.github_url },
    { label: 'Discord', url: project.discord_url },
  ];

  links.forEach(link => {
    if (!link.url) return;
    const anchor = document.createElement('a');
    anchor.className = 'button secondary';
    anchor.href = link.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = link.label;
    socialLinks.appendChild(anchor);
  });
}

function renderStats(data, updates) {
  updateCount.textContent = updates.length.toString();
  const reactions = normalizeArray(data.project_reactions);
  reactionCount.textContent = reactions.length.toString();

  const latest = updates
    .map(update => update.published_at || update.created_at)
    .filter(Boolean)
    .sort()
    .reverse()[0];

  lastUpdated.textContent = formatDate(latest);
}

function getSentimentClass(sentiment) {
  const value = (sentiment || '').toLowerCase();
  if (value === 'bullish' || value === 'positive') return 'success';
  if (value === 'bearish' || value === 'negative') return 'danger';
  if (value === 'neutral') return 'neutral';
  return 'warning';
}

function renderUpdate(update) {
  const card = document.createElement('article');
  card.className = 'card update-card';

  const header = document.createElement('div');
  header.className = 'update-header';

  const titleGroup = document.createElement('div');
  const title = document.createElement('h3');
  title.className = 'update-title';
  title.textContent = update.title || 'Untitled update';

  const meta = document.createElement('div');
  meta.className = 'update-meta';
  meta.innerHTML = `<span>${formatDate(update.published_at || update.created_at)}</span>`;

  titleGroup.appendChild(title);
  titleGroup.appendChild(meta);

  const badge = document.createElement('span');
  badge.className = `badge ${getSentimentClass(update.sentiment)}`;
  badge.textContent = update.sentiment || 'update';

  header.appendChild(titleGroup);
  header.appendChild(badge);

  const summary = document.createElement('div');
  summary.className = 'update-summary';
  summary.textContent = update.summary || 'Summary not available.';

  const tags = document.createElement('div');
  tags.className = 'tags';
  normalizeArray(update.content_tags).forEach(tag => {
    const tagEl = document.createElement('span');
    tagEl.className = 'tag';
    tagEl.textContent = tag;
    tags.appendChild(tagEl);
  });

  const details = document.createElement('details');
  const summaryToggle = document.createElement('summary');
  summaryToggle.textContent = 'Read full update';
  summaryToggle.className = 'button secondary';
  details.appendChild(summaryToggle);

  const content = document.createElement('div');
  content.className = 'update-content';
  content.innerHTML = update.content || '<p>No full content available.</p>';

  if (update.video_url) {
    const videoLink = document.createElement('a');
    videoLink.className = 'button ghost';
    videoLink.href = update.video_url;
    videoLink.target = '_blank';
    videoLink.rel = 'noopener noreferrer';
    videoLink.textContent = 'Watch video';
    content.appendChild(videoLink);
  }

  details.appendChild(content);

  card.appendChild(header);
  card.appendChild(summary);
  if (tags.childElementCount > 0) {
    card.appendChild(tags);
  }
  card.appendChild(details);

  return card;
}

function renderProject(data) {
  const project = getPrimaryProject(data);
  if (!project) {
    showBanner('No project data found.');
    return;
  }

  heroTitle.textContent = project.title || 'Project';
  heroDescription.textContent = project.description || '';
  heroLogo.src = project.logo_url || 'https://via.placeholder.com/320x180?text=Logo';
  heroLogo.alt = `${project.title || 'Project'} logo`;
  projectName.textContent = project.title || 'Project';

  websiteLink.href = project.website_url || '#';
  websiteLink.style.display = project.website_url ? 'inline-flex' : 'none';
  joinLink.href = project.generic_referral_link || project.website_url || '#';

  renderTags(project.tags);
  renderSocialLinks(project);

  const updates = normalizeArray(data.project_updates);
  renderStats(data, updates);

  projectInfoText = JSON.stringify(data, null, 2);

  updatesList.innerHTML = '';
  if (updates.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'notice';
    empty.textContent = 'No updates are available yet.';
    updatesList.appendChild(empty);
    return;
  }

  updates.forEach(update => updatesList.appendChild(renderUpdate(update)));
}

function buildResultDetails(title, bodyText) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ai-result';

  const details = document.createElement('details');
  details.open = true;

  const summary = document.createElement('summary');
  summary.textContent = title;

  const pre = document.createElement('pre');
  pre.textContent = bodyText;

  details.appendChild(summary);
  details.appendChild(pre);
  wrapper.appendChild(details);
  return wrapper;
}

function renderAssessment(parsed) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ai-result';

  const header = document.createElement('div');
  header.className = 'update-header';

  const title = document.createElement('div');
  title.innerHTML = `
    <h3 class="update-title">Risk Assessment</h3>
    <div class="update-meta">
      <span>Final score: ${parsed.final_score ?? 'N/A'}</span>
      <span>Risk tier: ${parsed.risk_tier ?? 'N/A'}</span>
    </div>
  `;

  header.appendChild(title);
  wrapper.appendChild(header);

  const metrics = document.createElement('div');
  metrics.className = 'ai-metrics';

  const scoreTable = document.createElement('table');
  const scoreHead = document.createElement('thead');
  scoreHead.innerHTML = '<tr><th>Category</th><th>Score</th></tr>';
  scoreTable.appendChild(scoreHead);

  const scoreBody = document.createElement('tbody');
  const categoryScores = parsed.category_scores || {};
  Object.entries(categoryScores).forEach(([key, value]) => {
    const row = document.createElement('tr');
    const name = key.replace(/_/g, ' ');
    row.innerHTML = `<td>${name}</td><td>${value}</td>`;
    scoreBody.appendChild(row);
  });
  scoreTable.appendChild(scoreBody);
  metrics.appendChild(scoreTable);

  const flagsWrapper = document.createElement('div');
  const flagsTitle = document.createElement('h4');
  flagsTitle.textContent = 'Red Flags Triggered';
  flagsWrapper.appendChild(flagsTitle);

  const flagsList = document.createElement('ul');
  (parsed.red_flags_triggered || []).forEach(flag => {
    const item = document.createElement('li');
    item.textContent = flag;
    flagsList.appendChild(item);
  });
  if (!flagsList.childElementCount) {
    const empty = document.createElement('li');
    empty.textContent = 'No red flags reported.';
    flagsList.appendChild(empty);
  }
  flagsWrapper.appendChild(flagsList);
  metrics.appendChild(flagsWrapper);

  wrapper.appendChild(metrics);

  const notesWrapper = document.createElement('div');
  notesWrapper.className = 'ai-notes';
  const notesDetails = document.createElement('details');
  notesDetails.open = false;
  const notesSummary = document.createElement('summary');
  notesSummary.textContent = 'Analyst Notes';
  const notesBody = document.createElement('p');
  notesBody.textContent = parsed.notes || 'No notes provided.';
  notesDetails.appendChild(notesSummary);
  notesDetails.appendChild(notesBody);
  notesWrapper.appendChild(notesDetails);
  wrapper.appendChild(notesWrapper);

  return wrapper;
}

function formatAiContent(content) {
  if (!content) return { parsed: null, text: 'No AI output returned.' };
  try {
    const parsed = typeof content === 'string' ? JSON.parse(content) : content;
    return { parsed, text: JSON.stringify(parsed, null, 2) };
  } catch (error) {
    return { parsed: null, text: content };
  }
}

async function handleAiRun() {
  if (!aiRunButton) {
    return;
  }
  if (!projectInfoText) {
    showBanner('Project data is required before running the AI assessment.');
    return;
  }

  const storedCredentials = sessionStorage.getItem('demoFullCredentials');
  const creds = storedCredentials ? JSON.parse(storedCredentials) : null;
  const apiKey = creds?.apiKey?.trim();

  if (!apiKey) {
    showBanner('Missing API key. Return to login to enter your OpenAI API key.');
    return;
  }

  aiRunButton.disabled = true;
  aiRunButton.innerHTML = '<span class="spinner" aria-hidden="true"></span> Running AI Risk Assessment';

  const { content, error } = await window.aiQueryApi.runAiQuery({
    apiUrl: AI_CONFIG.apiUrl,
    apiKey,
    model: AI_CONFIG.model,
    temperature: AI_CONFIG.temperature,
    maxTokens: AI_CONFIG.maxTokens,
    projectInfoText,
  });

  if (error) {
    aiRunButton.disabled = false;
    aiRunButton.textContent = 'Run AI Risk Assessment';
    showBanner(`AI query failed: ${error}`);
    return;
  }

  const formatted = formatAiContent(content);
  if (aiResults) {
    aiResults.innerHTML = '';
    if (formatted.parsed) {
      aiResults.appendChild(renderAssessment(formatted.parsed));
    } else {
      aiResults.appendChild(buildResultDetails('AI Risk Assessment Output', formatted.text));
    }
  }
  setAiSectionMode('results');
}

async function loadSampleData() {
  const response = await fetch(SAMPLE_URL);
  if (!response.ok) {
    throw new Error('Unable to load sample data.');
  }
  return response.json();
}

async function loadSampleAssessment() {
  const response = await fetch(SAMPLE_ASSESSMENT_URL);
  if (!response.ok) {
    throw new Error('Unable to load sample assessment.');
  }
  return response.json();
}

async function loadLiveData(credentials) {
  return window.demoFullApi.fetchProjectBundle(credentials);
}

async function init() {
  const sampleParam = new URLSearchParams(window.location.search).get('sample');
  const storedCredentials = sessionStorage.getItem('demoFullCredentials');
  const isSample = sampleParam || sessionStorage.getItem('demoFullSample');

  if (isSample) {
    sessionStorage.removeItem('demoFullCredentials');
  }

  if (storedCredentials) {
    try {
      const creds = JSON.parse(storedCredentials);
      userEmail.textContent = creds.email || 'user';
      const data = await loadLiveData(creds);
      renderProject(data);
      if (aiRunButton) {
        aiRunButton.addEventListener('click', handleAiRun);
      }
      setAiSectionMode('run');
      return;
    } catch (error) {
      showBanner(`Live fetch failed. Using sample data instead. (${error.message})`);
    }
  }

  if (isSample) {
    userEmail.textContent = 'sample';
    const data = await loadSampleData();
    renderProject(data);
    showBanner('Showing bundled sample data from output3.txt and a precomputed AI assessment.');
    setAiSectionMode('results');
    try {
      const assessment = await loadSampleAssessment();
      if (aiResults) {
        aiResults.innerHTML = '';
        aiResults.appendChild(renderAssessment(assessment));
      }
      if (aiRunButton) {
        aiRunButton.remove();
      }
    } catch (error) {
      if (aiRunButton) {
        aiRunButton.addEventListener('click', handleAiRun);
      }
      setAiSectionMode('run');
    }
    return;
  }

  showBanner('No session found. Please return to login or use sample data.');
  setAiSectionMode('run');
}

init();
