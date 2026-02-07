import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

interface LoginForm {
  email: string;
  password: string;
  projectId: string;
  apiKey?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
    projectId: 'bd77a557-86fd-4974-8457-f46d2fd3cb67',
    apiKey: '',
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    },
    onSuccess: () => {
      // Store credentials in sessionStorage so DemoFull can access them
      sessionStorage.setItem('demoFullCredentials', JSON.stringify(form));
      sessionStorage.removeItem('demoFullSample'); // Clear sample flag
      navigate('/demo-full');
    },
  });

  const handleSampleData = () => {
    sessionStorage.setItem('demoFullSample', 'true');
    sessionStorage.removeItem('demoFullCredentials'); // Clear credentials
    navigate('/demo-full?sample=true');
  };

  return (
    <div className="container max-w-2xl mx-auto px-5 py-20">
      <div className="card">
        <h1 className="text-3xl font-bold mb-2">Demo Full Access</h1>
        <p className="text-muted mb-6">
          Sign in with your iiZR credentials to fetch live project data. You can also continue
          with the bundled sample dataset.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginMutation.mutate(form);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm text-muted mb-2">iiZR Email</label>
            <input
              type="email"
              className="input w-full"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">iiZR Password</label>
            <input
              type="password"
              className="input w-full"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">OpenAI API Key</label>
            <input
              type="password"
              className="input w-full"
              value={form.apiKey}
              onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
              placeholder="sk-proj-..."
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">Project ID</label>
            <input
              type="text"
              className="input w-full"
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              required
            />
          </div>

          <p className="text-xs text-muted">
            Credentials are stored in session only and cleared when the tab is closed.
          </p>

          <div className="flex gap-3">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Logging in...' : 'Continue to Project'}
            </button>
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={handleSampleData}
            >
              Use Sample Data
            </button>
          </div>

          {loginMutation.isError && (
            <div className="text-danger text-sm">
              Login failed. Please check your credentials.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
