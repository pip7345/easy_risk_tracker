// Shared constants

export const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000';

export const ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    STATUS: '/api/auth/status',
  },
  PROJECTS: {
    FETCH: '/api/projects/fetch',
    SAMPLE: '/api/projects/sample',
  },
  AI: {
    QUERY: '/api/ai/query',
  },
} as const;

export const QUERY_KEYS = {
  AUTH_STATUS: ['auth', 'status'],
  PROJECT: (id: string) => ['project', id],
  PROJECT_SAMPLE: ['project', 'sample'],
} as const;

export const DEFAULT_PROJECT_ID = 'bd77a557-86fd-4974-8457-f46d2fd3cb67';

export const RISK_LEVELS = {
  LOW: { min: 0, max: 3, label: 'Low Risk', color: '#10b981' },
  MEDIUM: { min: 3, max: 6, label: 'Medium Risk', color: '#f59e0b' },
  HIGH: { min: 6, max: 8, label: 'High Risk', color: '#ef4444' },
  CRITICAL: { min: 8, max: 10, label: 'Critical Risk', color: '#dc2626' },
} as const;
