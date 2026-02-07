import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

interface ProjectData {
  id: string;
  name: string;
  description: string;
  website?: string;
  joinLink?: string;
  logo?: string;
  tags?: string[];
  updates?: any[];
  stats?: {
    updateCount: number;
    reactionCount: number;
    lastUpdated: string;
  };
}

export default function DemoFull() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const useSample = searchParams.get('sample') === 'true';
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [userEmail, setUserEmail] = useState('');

  // Check if user is authenticated
  const { data: authStatus } = useQuery({
    queryKey: ['auth-status'],
    queryFn: async () => {
      const res = await fetch('/api/auth/status', { credentials: 'include' });
      return res.json();
    },
  });

  // Fetch project data
  useEffect(() => {
    const credentials = sessionStorage.getItem('demoFullCredentials');
    const sample = sessionStorage.getItem('demoFullSample');
    
    if (sample || useSample) {
      // Load sample data
      loadSampleData();
    } else if (credentials) {
      const creds = JSON.parse(credentials);
      setUserEmail(creds.email);
      fetchProjectData(creds.projectId);
    } else if (!authStatus?.authenticated) {
      // Not logged in, redirect to login
      navigate('/login');
    }
  }, [authStatus, useSample, navigate]);

  const loadSampleData = () => {
    setUserEmail('demo@example.com');
    setProjectData({
      id: 'sample',
      name: 'Bellator',
      description: 'Sample project data for demonstration purposes',
      website: 'https://example.com',
      joinLink: 'https://example.com/join',
      logo: 'https://via.placeholder.com/200',
      tags: ['DeFi', 'Gaming', 'NFT'],
      stats: {
        updateCount: 12,
        reactionCount: 145,
        lastUpdated: '2 days ago'
      },
      updates: [
        {
          id: '1',
          title: 'Platform Launch',
          content: 'Successfully launched the platform beta',
          timestamp: '2024-01-15',
          category: 'milestone'
        },
        {
          id: '2',
          title: 'New Partnership',
          content: 'Announced partnership with major exchange',
          timestamp: '2024-01-10',
          category: 'partnership'
        }
      ]
    });
  };

  const fetchProjectData = async (projectId: string) => {
    try {
      const res = await fetch('/api/projects/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ projectId })
      });
      if (res.ok) {
        const data = await res.json();
        setProjectData(data.project);
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  };

  const runAIAssessment = useMutation({
    mutationFn: async () => {
      const credentials = sessionStorage.getItem('demoFullCredentials');
      if (!credentials) throw new Error('No credentials');
      
      const creds = JSON.parse(credentials);
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          projectData,
          methodology: 'Analyze this crypto project for risk factors...',
          apiKey: creds.apiKey
        })
      });
      if (!res.ok) throw new Error('AI query failed');
      return res.json();
    }
  });

  const handleLogout = () => {
    sessionStorage.removeItem('demoFullCredentials');
    sessionStorage.removeItem('demoFullSample');
    navigate('/login');
  };

  if (!projectData) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-muted">Loading project data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface grid" style={{ gridTemplateColumns: '260px 1fr' }}>
      {/* Sidebar */}
      <aside className="bg-gradient-to-b from-surface/95 to-surface/60 border-r border-border p-6 flex flex-col gap-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3">
          <div className="w-12 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white shadow-lg">
            iiZR
          </div>
          <div>
            <strong className="block text-sm">Investment Made Easy</strong>
            <span className="text-xs text-muted">Demo Full</span>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <a className="px-4 py-2.5 rounded-lg bg-primary/15 text-text font-medium" href="#">
            Projects
          </a>
          <a className="px-4 py-2.5 rounded-lg text-muted hover:bg-surface hover:text-text transition-colors" href="#">
            Easy Risk Tracker
          </a>
          <a className="px-4 py-2.5 rounded-lg text-muted hover:bg-surface hover:text-text transition-colors" href="#">
            Portfolio
          </a>
          <a className="px-4 py-2.5 rounded-lg text-muted hover:bg-surface hover:text-text transition-colors" href="#">
            Subscriptions
          </a>
        </nav>

        <div className="mt-auto space-y-3">
          <div className="text-xs text-muted">
            Signed in as <span className="text-text">{userEmail}</span>
          </div>
          <button onClick={handleLogout} className="btn-secondary w-full text-sm">
            Back to Login
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div>
        {/* Top Bar */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-border backdrop-blur-sm bg-surface/65 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-muted">
            <span>Home</span>
            <span>›</span>
            <span>Projects</span>
            <span>›</span>
            <strong className="text-text">{projectData.name}</strong>
          </div>
          <div className="flex gap-3">
            {projectData.website && (
              <a href={projectData.website} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
                Website
              </a>
            )}
            {projectData.joinLink && (
              <a href={projectData.joinLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                Join Project
              </a>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="container max-w-7xl mx-auto px-8 py-6">
          {/* Hero Section */}
          <section className="card grid gap-6" style={{ gridTemplateColumns: 'minmax(0, 1fr) 280px' }}>
            <div>
              <h1 className="text-4xl font-bold mb-3">{projectData.name}</h1>
              <p className="text-muted leading-relaxed mb-4">{projectData.description}</p>
              {projectData.tags && (
                <div className="flex flex-wrap gap-2">
                  {projectData.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full border border-border/35 bg-surface/50 text-xs text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-4">
              {projectData.logo && (
                <img src={projectData.logo} alt="Project logo" className="w-full h-44 object-cover rounded-xl border border-border" />
              )}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-bg/40 border border-border">
                  <h3 className="text-2xl font-bold">{projectData.stats?.updateCount || 0}</h3>
                  <span className="text-xs text-muted">Updates</span>
                </div>
                <div className="p-4 rounded-xl bg-bg/40 border border-border">
                  <h3 className="text-2xl font-bold">{projectData.stats?.reactionCount || 0}</h3>
                  <span className="text-xs text-muted">Total reactions</span>
                </div>
                <div className="p-4 rounded-xl bg-bg/40 border border-border">
                  <h3 className="text-lg font-bold">{projectData.stats?.lastUpdated || '-'}</h3>
                  <span className="text-xs text-muted">Last published</span>
                </div>
              </div>
            </div>
          </section>

          {/* AI Assessment Section */}
          <section className="card mt-6">
            <h2 className="text-2xl font-bold mb-4">AI Risk Assessment</h2>
            <button 
              onClick={() => runAIAssessment.mutate()}
              disabled={runAIAssessment.isPending}
              className="btn-primary"
            >
              {runAIAssessment.isPending ? 'Running Assessment...' : 'Run AI Risk Assessment'}
            </button>
            
            {runAIAssessment.data && (
              <div className="mt-6 p-6 rounded-xl bg-surface border border-border">
                <pre className="text-sm whitespace-pre-wrap text-muted">
                  {JSON.stringify(runAIAssessment.data.result, null, 2)}
                </pre>
              </div>
            )}
          </section>

          {/* Updates List */}
          <h2 className="text-2xl font-bold mt-8 mb-4">Latest Updates</h2>
          <div className="grid gap-4">
            {projectData.updates && projectData.updates.length > 0 ? (
              projectData.updates.map(update => (
                <div key={update.id} className="card">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{update.title}</h3>
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold capitalize">
                      {update.category}
                    </span>
                  </div>
                  <p className="text-muted mb-3">{update.content}</p>
                  <div className="text-xs text-muted">{update.timestamp}</div>
                </div>
              ))
            ) : (
              <div className="card text-center text-muted py-12">
                No updates available
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
