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

const SAMPLE_URL = 'output3.json';

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

async function loadSampleData() {
  const response = await fetch(SAMPLE_URL);
  if (!response.ok) {
    throw new Error('Unable to load sample data.');
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

  if (storedCredentials) {
    try {
      const creds = JSON.parse(storedCredentials);
      userEmail.textContent = creds.email || 'user';
      const data = await loadLiveData(creds);
      renderProject(data);
      return;
    } catch (error) {
      showBanner(`Live fetch failed. Using sample data instead. (${error.message})`);
    }
  }

  if (isSample) {
    userEmail.textContent = 'sample';
    const data = await loadSampleData();
    renderProject(data);
    showBanner('Showing bundled sample data from output3.txt.');
    return;
  }

  showBanner('No session found. Please return to login or use sample data.');
}

init();
