import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container max-w-5xl mx-auto px-5 py-10">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Crypto Bros Platform</h1>
        <p className="text-muted">
          Multi-project platform featuring the Easy Risk Tracker documentation and interactive demos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/docs" className="card hover:-translate-y-1 transition-transform">
          <h2 className="text-xl font-bold mb-2">📚 Documentation</h2>
          <p className="text-sm text-muted mb-3">
            Complete Easy Risk Tracker methodology and scoring system documentation.
          </p>
          <span className="inline-block px-3 py-1 rounded-full bg-surface text-muted text-xs">
            Docusaurus
          </span>
        </Link>

        <Link to="/demo" className="card hover:-translate-y-1 transition-transform">
          <h2 className="text-xl font-bold mb-2">🎮 Simple Demo</h2>
          <p className="text-sm text-muted mb-3">
            Engineering tool that contains enough details to implement on iiZR.
          </p>
          <span className="inline-block px-3 py-1 rounded-full bg-surface text-muted text-xs">
            Interactive
          </span>
        </Link>

        <Link to="/demo-full" className="card hover:-translate-y-1 transition-transform">
          <h2 className="text-xl font-bold mb-2">🚀 Full Demo</h2>
          <p className="text-sm text-muted mb-3">
            Not working yet.
          </p>
          <span className="inline-block px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-semibold">
            Premium
          </span>
        </Link>
      </div>

      <div className="mt-12 card bg-accent/10 border-accent/30">
        <h3 className="text-lg font-semibold mb-2">🎯 What's New</h3>
        <p className="text-sm text-muted">
          This platform has been rebuilt as a modern monorepo with React, TypeScript, and Tailwind CSS.
          All demos now use a REST API backend for improved security and performance.
        </p>
      </div>
    </div>
  );
}
