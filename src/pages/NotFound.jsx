import { Link } from "@/lib/router-compat";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-5 md:px-8 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-valley-clay mb-4">404</p>
      <h1 className="font-display text-4xl mb-6">This table isn't set.</h1>
      <p className="text-valley-ink/70 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="bg-valley-forest text-valley-ivory font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-sm inline-block">
        Back home
      </Link>
    </div>
  );
}
