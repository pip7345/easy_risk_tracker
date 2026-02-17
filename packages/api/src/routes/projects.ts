import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { ApiErrorClass } from '../middleware/errorHandler.js';

const router = Router();

const SUPABASE_URL = 'https://api.iizr.app';
const REST_BASE = `${SUPABASE_URL}/rest/v1`;
const AUTH_URL = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cXlqbW13eXpkYXh0c2x1dG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MzU5NzEsImV4cCI6MjA2ODAxMTk3MX0.Oqdcgm7pqN4fWa6811cBn6afaIUH4QBSYp23oEx7bSY';

function buildRestUrl(table: string, params: Record<string, string | number | undefined | null>) {
  const url = new URL(`${REST_BASE}/${table}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function fetchJson(url: string, options: RequestInit, { optional = false }: { optional?: boolean } = {}) {
  const response = await fetch(url, options);
  const text = await response.text();

  if (!response.ok) {
    const message = `Request failed (${response.status}) for ${url}: ${text.slice(0, 500)}`;
    if (optional) return { error: message, url };
    throw new Error(message);
  }

  try {
    return JSON.parse(text);
  } catch {
    const message = `Invalid JSON response for ${url}`;
    if (optional) return { error: message, url };
    throw new Error(message);
  }
}

async function login(email: string, password: string) {
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

  if (!response?.access_token) {
    throw new ApiErrorClass('IIZR authentication failed. Please check your credentials.', 401);
  }

  return response.access_token as string;
}

function authHeaders(accessToken: string) {
  return {
    apikey: ANON_KEY,
    authorization: `Bearer ${accessToken}`,
    accept: 'application/json',
  };
}

async function fetchProjectData(projectId: string, headers: Record<string, string>) {
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

  let updateReactions: any[] = [];
  const updateIds = Array.isArray(projectUpdates)
    ? projectUpdates.map((update: any) => update.id).filter(Boolean)
    : [];

  if (updateIds.length > 0) {
    const updateReactionsUrl = buildRestUrl('update_reactions', {
      select: '*',
      update_id: `in.(${updateIds.join(',')})`,
    });
    const maybeUpdateReactions = await fetchJson(updateReactionsUrl, { headers }, { optional: true });
    updateReactions = Array.isArray(maybeUpdateReactions) ? maybeUpdateReactions : [];
  }

  let profiles: any[] = [];
  const adminUserIds = Array.isArray(adminAssignments)
    ? adminAssignments.map((row: any) => row.user_id).filter(Boolean)
    : [];

  if (adminUserIds.length > 0) {
    const profilesUrl = buildRestUrl('profiles', {
      select: 'display_name,email,avatar_url',
      user_id: `in.(${adminUserIds.join(',')})`,
    });
    const maybeProfiles = await fetchJson(profilesUrl, { headers }, { optional: true });
    profiles = Array.isArray(maybeProfiles) ? maybeProfiles : [];
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

// Fetch project data from IIZR platform
router.post('/fetch', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      throw new ApiErrorClass('Project ID required', 400);
    }

    // Get stored IIZR credentials
    const iizrCreds = req.cookies.iizr_creds;
    if (!iizrCreds) {
      throw new ApiErrorClass('IIZR credentials not found', 401);
    }

    const { email, password } = JSON.parse(iizrCreds);

    try {
      const accessToken = await login(email, password);
      const headers = authHeaders(accessToken);
      const raw = await fetchProjectData(projectId, headers);

      const project = Array.isArray(raw.project) ? raw.project[0] : undefined;
      const updates = Array.isArray(raw.project_updates) ? raw.project_updates : [];

      const formattedProject = project
        ? {
            id: project.id,
            name: project.title,
            description: project.description,
            website: project.website_url,
            joinLink: project.generic_referral_link,
            logo: project.logo_url,
            tags: project.tags,
            stats: {
              updateCount: updates.length,
              reactionCount: Array.isArray(raw.project_reactions) ? raw.project_reactions.length : 0,
              lastUpdated: updates.length > 0
                ? new Date(updates[0].created_at).toLocaleDateString()
                : 'N/A',
            },
            updates: updates.slice(0, 10).map((u: any) => ({
              id: u.id,
              title: u.title,
              content: u.summary || (u.content ? String(u.content).replace(/<[^>]*>/g, '').substring(0, 300) + '...' : ''),
              timestamp: u.published_at ? new Date(u.published_at).toLocaleDateString() : '',
              category: u.content_tags?.[0] || 'Update',
            })),
          }
        : null;

      if (!formattedProject) {
        throw new ApiErrorClass('Project not found or not accessible with these credentials.', 404);
      }

      res.json({
        success: true,
        project: formattedProject,
        raw,
      });
    } catch (error: any) {
      if (error.cause?.code === 'ENOTFOUND' || error.code === 'ENOTFOUND') {
        throw new ApiErrorClass('Unable to reach IIZR API (api.iizr.app). Please check your internet connection or use sample data.', 503);
      }
      if (error instanceof ApiErrorClass) throw error;
      const message = String(error?.message || error);
      if (message.includes('Request failed (400)') || message.includes('Request failed (401)') || message.includes('Request failed (403)')) {
        throw new ApiErrorClass('IIZR authentication failed. Please check your credentials.', 401);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

// Use sample data (for demo purposes)
router.get('/sample', (_req, res) => {
  // Return sample project data
  res.json({
    success: true,
    project: {
      id: 'bd77a557-86fd-4974-8457-f46d2fd3cb67',
      name: 'Bellator',
      description: 'Sample project data',
      // Add more sample data as needed
    }
  });
});

export default router;
