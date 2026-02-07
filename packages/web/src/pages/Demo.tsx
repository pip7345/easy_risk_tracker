import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export default function Demo() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [projectId, setProjectId] = useState('bd77a557-86fd-4974-8457-f46d2fd3cb67');
  const [apiKey, setApiKey] = useState('');
  const [projectData, setProjectData] = useState<any>(null);
  const [aiResult, setAiResult] = useState<any>(null);

  const fetchProject = useMutation({
    mutationFn: async () => {
      // First login
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, projectId }),
      });
      if (!loginRes.ok) throw new Error('Login failed');

      // Then fetch project
      const projectRes = await fetch('/api/projects/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ projectId }),
      });
      if (!projectRes.ok) throw new Error('Fetch failed');
      return projectRes.json();
    },
    onSuccess: (data) => {
      setProjectData(data.project);
    },
  });

  const queryAI = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          projectData,
          methodology: 'Analyze this crypto project for risk factors...',
          apiKey: apiKey || undefined,
        }),
      });
      if (!res.ok) throw new Error('AI query failed');
      return res.json();
    },
    onSuccess: (data) => {
      setAiResult(data.result);
    },
  });

  return (
    <div className="container max-w-4xl mx-auto px-5 py-10">
      <h1 className="text-3xl font-bold mb-2">Easy Risk Tracker Demo</h1>
      <p className="text-muted mb-8">
        Fetch project data from iiZR and run AI-powered risk assessments.
      </p>

      <div className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Project Fetch</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-muted mb-1">iiZR Email</label>
              <input
                type="email"
                className="input w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">iiZR Password</label>
              <input
                type="password"
                className="input w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Project ID</label>
              <input
                type="text"
                className="input w-full"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              />
            </div>
            <button
              className="btn-primary"
              onClick={() => fetchProject.mutate()}
              disabled={fetchProject.isPending}
            >
              {fetchProject.isPending ? 'Fetching...' : 'Fetch Project'}
            </button>
          </div>
          
          {projectData && (
            <div className="mt-4 p-4 bg-surface rounded-lg">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(projectData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {projectData && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">AI Query</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-muted mb-1">OpenAI API Key (optional)</label>
                <input
                  type="password"
                  className="input w-full"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Uses server key if not provided"
                />
              </div>
              <button
                className="btn-primary"
                onClick={() => queryAI.mutate()}
                disabled={queryAI.isPending}
              >
                {queryAI.isPending ? 'Analyzing...' : 'Run AI Analysis'}
              </button>
            </div>

            {aiResult && (
              <div className="mt-4 p-4 bg-surface rounded-lg">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(aiResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
