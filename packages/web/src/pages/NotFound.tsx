import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container max-w-2xl mx-auto px-5 py-20 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted mb-8">Page not found</p>
      <Link to="/" className="btn-primary inline-block">
        Go Home
      </Link>
    </div>
  );
}
