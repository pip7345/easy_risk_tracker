import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { METHODOLOGY_TEXT } from '../utils/methodology';

export default function Demo() {
  const [email, setEmail] = useState('pip7345@yahoo.com');
  const [password, setPassword] = useState('');
  const [projectId, setProjectId] = useState('bd77a557-86fd-4974-8457-f46d2fd3cb67');
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('https://api.openai.com/v1/chat/completions');
  const [model, setModel] = useState('gpt-5.2');
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(1800);
  const [projectData, setProjectData] = useState<any>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [fetchPanelOpen, setFetchPanelOpen] = useState(true);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);

  const methodology = METHODOLOGY_TEXT;

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
          methodology,
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

  const queryPreview = projectData ? JSON.stringify({
    model,
    temperature,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: 'You are a cryptocurrency project risk analyst.' },
      { role: 'user', content: `${methodology}\n\nProject Data:\n${JSON.stringify(projectData, null, 2)}` }
    ]
  }, null, 2) : 'Query preview will appear here after fetching the project.';

  return (
    <div className="container max-w-4xl mx-auto px-5 py-8">
      <h1 className="text-3xl font-bold mb-3">Easy Risk Tracker Demo</h1>
      <p className="text-muted mb-4">
        The purpose of this demo is to show the capabilities of the easy risk tracker javascript files. 
        The two controls below allow you to fetch project data and send AI queries. All data is sent in 
        json format which is what the back end expects.
      </p>

      <h2 className="text-xl font-bold mb-2">Cost and requirements to use</h2>
      <p className="text-muted mb-2">
        Each query costs $0.09 approximately to use. An account is not required, but you have to add 
        pre-paid tokens to the account. I added approximately $10 to an account and created an API key. 
        Send me a message on slack and I can send you my personal API KEY.
      </p>
      <p className="text-muted mb-4">
        To execute the AI query, you will need an API key. You can create one at{' '}
        <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          https://platform.openai.com/account/api-keys
        </a>{' '}
        You will have to add tokens to ChatGPT to get it to work. I used a personal API key and each query 
        costs $0.09 approximately. Different models may cost different amounts.
      </p>
      <p className="text-muted mb-4">
        To start, enter your iiZR username and password. The default Project ID is for Bellator, but you 
        can change this to any project you have access to. Click "Fetch Project" to retrieve the project 
        data in json format. The output will be displayed in the box below the form. This data will be 
        used to construct an AI query.
      </p>

      <p className="text-muted mb-2">These files are included in the demo:</p>
      <ul className="list-disc list-inside text-muted space-y-1 mb-6">
        <li>
          <strong>methodology.js</strong>: Contains the AI prompt used to calculate the scoring for the 
          easy risk tracker. This file should be altered by analysts and will evolve over time. This will 
          be used in the final product or the query could optionally be stored in the database so it is 
          easier to modify.
        </li>
        <li>
          <strong>ai-query.js</strong>: Sends queries to an AI model and retrieves responses. This will be 
          used in the final product.
        </li>
        <li>
          <strong>app.js</strong>: Main application logic to handle user interactions and coordinate between 
          other scripts.
        </li>
        <li>
          <strong>project-fetch.js</strong>: Fetches project data from iiZR platform in json format. This 
          should only be required for the demo.
        </li>
      </ul>

      <div className="space-y-6">
        {/* Project Fetch Panel */}
        <details className="card" open={fetchPanelOpen} onToggle={(e) => setFetchPanelOpen((e.target as HTMLDetailsElement).open)}>
          <summary className="text-xl font-bold cursor-pointer mb-4">Project Fetch</summary>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              fetchProject.mutate();
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-sm text-muted mb-1">
                iiZR Username (email)
              </label>
              <input
                type="email"
                className="input w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">
                iiZR Password
              </label>
              <input
                type="password"
                className="input w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">
                Project ID
              </label>
              <input
                type="text"
                className="input w-full"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={fetchProject.isPending}
            >
              {fetchProject.isPending ? 'Fetching...' : 'Fetch Project'}
            </button>
          </form>
          
          <div className="mt-4 p-4 bg-surface rounded-lg border border-border">
            <pre className="text-xs overflow-auto text-muted">
              {projectData ? JSON.stringify(projectData, null, 2) : 'Project json output will appear here.'}
            </pre>
          </div>
        </details>

        {/* AI Query Panel */}
        <details className="card" open={aiPanelOpen} onToggle={(e) => setAiPanelOpen((e.target as HTMLDetailsElement).open)}>
          <summary className="text-xl font-bold cursor-pointer mb-4">AI Query</summary>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              queryAI.mutate();
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-sm text-muted mb-1">
                API URL
              </label>
              <input
                type="url"
                className="input w-full"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">
                API Key
              </label>
              <input
                type="password"
                className="input w-full"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-proj-"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">
                Model
              </label>
              <select
                className="input w-full"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              >
                <option value="gpt-5.2">gpt-5.2</option>
                <option value="gpt-5.2-pro">gpt-5.2-pro</option>
                <option value="gpt-5-mini">gpt-5-mini</option>
                <option value="gpt-5-nano">gpt-5-nano</option>
                <option value="gpt-4.1">gpt-4.1</option>
                <option value="gpt-4.1-mini">gpt-4.1-mini</option>
                <option value="gpt-4.1-nano">gpt-4.1-nano</option>
                <option value="gpt-4o">gpt-4o</option>
                <option value="gpt-4o-mini">gpt-4o-mini</option>
                <option value="gpt-4-turbo">gpt-4-turbo</option>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                <option value="gpt-5-chat-latest">gpt-5-chat-latest</option>
                <option value="chatgpt-4o-latest">chatgpt-4o-latest</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">
                Temperature
              </label>
              <input
                type="number"
                className="input w-full"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                step="0.1"
                min="0"
                max="2"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">
                Max Tokens
              </label>
              <input
                type="number"
                className="input w-full"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                min="1"
              />
            </div>

            <div className="mt-4 p-4 bg-surface rounded-lg border border-border">
              <pre className="text-xs overflow-auto text-muted">
                {queryPreview}
              </pre>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={queryAI.isPending || !projectData}
            >
              {queryAI.isPending ? 'Analyzing...' : 'AI Query'}
            </button>
          </form>

          <div className="mt-4 p-4 bg-surface rounded-lg border border-border">
            <pre className="text-xs overflow-auto text-muted">
              {aiResult ? JSON.stringify(aiResult, null, 2) : 'AI response will appear here.'}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
}
