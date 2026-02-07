// Common types shared between frontend and backend

export interface User {
  id: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status?: 'active' | 'inactive' | 'pending';
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  content: string;
  category?: string;
  timestamp: string;
  author?: string;
}

export interface RiskAssessment {
  projectId: string;
  overallScore: number;
  categories: RiskCategory[];
  analysis: string;
  recommendations: string[];
  timestamp: string;
}

export interface RiskCategory {
  name: string;
  score: number;
  weight: number;
  findings: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface AIQueryRequest {
  projectData: any;
  methodology: string;
  apiKey?: string;
}

export interface AIQueryResponse {
  success: boolean;
  result: any;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  projectId?: string;
}

export interface ProjectFetchRequest {
  projectId: string;
}

export interface ProjectFetchResponse {
  success: boolean;
  project: Project;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
