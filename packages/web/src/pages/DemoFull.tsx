import { useSearchParams } from 'react-router-dom';

export default function DemoFull() {
  const [searchParams] = useSearchParams();
  const useSample = searchParams.get('sample') === 'true';

  return (
    <div className="min-h-screen bg-surface">
      <div className="container max-w-7xl mx-auto px-5 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Full Project Dashboard</h1>
          <p className="text-muted">
            {useSample ? 'Using sample project data' : 'Connected to live project data'}
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Project Overview</h2>
          <p className="text-muted">
            This is the full demo dashboard. Components will be implemented here to show:
          </p>
          <ul className="list-disc list-inside text-muted space-y-2 mt-4">
            <li>Project metadata and statistics</li>
            <li>Risk assessment scores</li>
            <li>AI-generated analysis</li>
            <li>Interactive charts and visualizations</li>
            <li>Update history timeline</li>
          </ul>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <h3 className="text-sm text-muted mb-1">Risk Score</h3>
            <div className="text-3xl font-bold text-warning">6.5</div>
          </div>
          <div className="card">
            <h3 className="text-sm text-muted mb-1">Total Updates</h3>
            <div className="text-3xl font-bold text-accent">12</div>
          </div>
          <div className="card">
            <h3 className="text-sm text-muted mb-1">Status</h3>
            <div className="text-3xl font-bold text-success">Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}
