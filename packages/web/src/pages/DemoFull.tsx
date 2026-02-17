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
  const [aiResult, setAiResult] = useState<any>(null);

  // Load demo-full styles
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/demo-full-styles.css';
    document.head.appendChild(link);
    
    // Load project-fetch.js script
    const script = document.createElement('script');
    script.src = '/project-fetch.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

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

  const loadSampleData = async () => {
    setUserEmail('demo@example.com');
    
    try {
      // Load real sample project data from JSON file
      const response = await fetch('/sample-project.json');
      const data = await response.json();
      
      const project = data.project[0];
      const updates = data.project_updates || [];
      
      setProjectData({
        id: project.id,
        name: project.title,
        description: project.description,
        website: project.website_url,
        joinLink: project.generic_referral_link,
        logo: project.logo_url,
        tags: project.tags,
        stats: {
          updateCount: updates.length,
          reactionCount: 0,
          lastUpdated: updates.length > 0 ? new Date(updates[0].created_at).toLocaleDateString() : 'N/A'
        },
        updates: updates.slice(0, 10).map((u: any) => ({
          id: u.id,
          title: u.title,
          content: u.summary || u.content?.replace(/<[^>]*>/g, '').substring(0, 300) + '...',
          timestamp: new Date(u.published_at).toLocaleDateString(),
          category: u.content_tags?.[0] || 'Update'
        }))
      });
    } catch (error) {
      console.error('Failed to load sample data:', error);
      // Fallback to inline data
      setProjectData({
        id: 'sample',
        name: 'Bellator',
        description: 'Sample project data for demonstration purposes. This is a comprehensive crypto gaming platform combining DeFi elements with NFT integration to create a unique ecosystem for gamers and investors.',
        website: 'https://example.com',
        joinLink: 'https://example.com/join',
        logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%230f172a" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="60" fill="%2338bdf8"%3EB%3C/text%3E%3C/svg%3E',
        tags: ['DeFi', 'Gaming', 'NFT', 'Metaverse', 'Web3'],
        stats: {
          updateCount: 12,
          reactionCount: 145,
          lastUpdated: '2 days ago'
        },
        updates: [
          {
            id: '1',
            title: 'Platform Launch',
            content: 'Successfully launched the platform beta with over 5,000 early adopters. The community response has been overwhelming.',
            timestamp: '2024-01-15',
            category: 'milestone'
          }
        ]
      });
    }
  };

  const fetchProjectData = async (projectId: string) => {
    try {
      const credentials = sessionStorage.getItem('demoFullCredentials');
      if (!credentials) {
        console.error('No credentials found');
        return;
      }
      
      const creds = JSON.parse(credentials);
      
      // Use the project-fetch.js API if available
      if ((window as any).projectFetchApi) {
        const jsonData = await (window as any).projectFetchApi.fetchProjectInfo({
          email: creds.email,
          password: creds.password,
          projectId: creds.projectId
        });
        
        const data = JSON.parse(jsonData);
        const project = data.project[0];
        const updates = data.project_updates || [];
        
        setProjectData({
          id: project.id,
          name: project.title,
          description: project.description,
          website: project.website_url,
          joinLink: project.generic_referral_link,
          logo: project.logo_url,
          tags: project.tags,
          stats: {
            updateCount: updates.length,
            reactionCount: data.project_reactions?.length || 0,
            lastUpdated: updates.length > 0 ? new Date(updates[0].created_at).toLocaleDateString() : 'N/A'
          },
          updates: updates.slice(0, 10).map((u: any) => ({
            id: u.id,
            title: u.title,
            content: u.summary || u.content?.replace(/<[^>]*>/g, '').substring(0, 300) + '...',
            timestamp: new Date(u.published_at).toLocaleDateString(),
            category: u.content_tags?.[0] || 'Update'
          }))
        });
      } else {
        // Fallback to API endpoint
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
      const data = await res.json();
      setAiResult(data.result);
      return data;
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
    <div className="page-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">iiZR</div>
          <div>
            <strong>Investment Made Easy</strong>
            <div><span>Demo Full</span></div>
          </div>
        </div>

        <nav className="nav">
          <a className="active" href="#">Projects</a>
          <a href="#">Easy Risk Tracker</a>
          <a href="#">Portfolio</a>
          <a href="#">Subscriptions</a>
          <a href="#">Referrals</a>
        </nav>

        <div className="sidebar-footer">
          <div>Signed in as <span>{userEmail}</span></div>
          <button onClick={handleLogout} className="button secondary">Back to Login</button>
        </div>
      </aside>

      <div>
        <header className="topbar">
          <div className="breadcrumb">
            <span>Home</span>
            <span>›</span>
            <span>Projects</span>
            <span>›</span>
            <strong>{projectData.name}</strong>
          </div>
          <div className="action-buttons">
            {projectData.website && (
              <a className="button secondary" href={projectData.website} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            )}
            {projectData.joinLink && (
              <a className="button ghost" href={projectData.joinLink} target="_blank" rel="noopener noreferrer">
                Join Project
              </a>
            )}
          </div>
        </header>

        <main className="container">
          <section className="card hero">
            <div>
              <h1 className="title">{projectData.name}</h1>
              <p className="subtitle">{projectData.description}</p>
              <div className="tags">
                {projectData.tags?.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <div className="update-actions">
                {projectData.website && (
                  <a href={projectData.website} target="_blank" rel="noopener noreferrer">
                    🌐 Website
                  </a>
                )}
              </div>
            </div>
            <div>
              {projectData.logo && (
                <img className="hero-logo" src={projectData.logo} alt="Project logo" />
              )}
              <div className="stats">
                <div className="stat">
                  <h3>{projectData.stats?.updateCount || 0}</h3>
                  <span>Updates</span>
                </div>
                <div className="stat">
                  <h3>{projectData.stats?.reactionCount || 0}</h3>
                  <span>Total reactions</span>
                </div>
                <div className="stat">
                  <h3>{projectData.stats?.lastUpdated || '-'}</h3>
                  <span>Last published</span>
                </div>
              </div>
            </div>
          </section>

          <section className="card ai-card">
            {!aiResult ? (
              <div className="ai-action">
                <h2 className="section-title">AI Risk Assessment</h2>
                <button 
                  className="button" 
                  onClick={() => runAIAssessment.mutate()}
                  disabled={runAIAssessment.isPending}
                >
                  {runAIAssessment.isPending ? 'Running Assessment...' : 'Run AI Risk Assessment'}
                </button>
              </div>
            ) : (
              <div className="ai-action">
                <h2 className="section-title">AI Risk Assessment Results</h2>
                <div className="ai-results">
                  {typeof aiResult === 'object' ? (
                    <>
                      <div className="risk-score">
                        <h3>Risk Score: {aiResult.final_score?.toFixed(2) || 'N/A'}</h3>
                        <p className="risk-tier">{aiResult.risk_tier || 'Unknown'}</p>
                      </div>
                      
                      {aiResult.category_scores && (
                        <div className="category-scores">
                          <h4>Category Scores</h4>
                          {Object.entries(aiResult.category_scores).map(([key, value]) => (
                            <div key={key} className="score-item">
                              <span>{key.replace(/_/g, ' ')}</span>
                              <span>{typeof value === 'number' ? value.toFixed(1) : String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {aiResult.red_flags_triggered && aiResult.red_flags_triggered.length > 0 && (
                        <div className="red-flags">
                          <h4>Red Flags</h4>
                          <ul>
                            {aiResult.red_flags_triggered.map((flag: string, idx: number) => (
                              <li key={idx}>{flag}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {aiResult.notes && (
                        <div className="notes">
                          <h4>Notes</h4>
                          <p>{aiResult.notes}</p>
                        </div>
                      )}
                      
                      <button className="button secondary" onClick={() => setAiResult(null)}>
                        Run New Assessment
                      </button>
                    </>
                  ) : (
                    <pre>{JSON.stringify(aiResult, null, 2)}</pre>
                  )}
                </div>
              </div>
            )}
          </section>

          <h2 className="section-title">Latest Updates</h2>
          <section className="grid">
            {projectData.updates && projectData.updates.length > 0 ? (
              projectData.updates.map(update => (
                <div key={update.id} className="card update-card">
                  <div className="update-header">
                    <h3>{update.title}</h3>
                    <span className="badge">{update.category}</span>
                  </div>
                  <p>{update.content}</p>
                  <div className="update-meta">
                    <span>{update.timestamp}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="card">
                <p className="text-center text-muted">No updates available</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
