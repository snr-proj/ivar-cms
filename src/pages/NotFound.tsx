import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center gap-6">
      <p className="label">404 — PAGE NOT FOUND</p>
      <Link to="/" className="label hover:text-accent transition-colors">
        ← BACK HOME
      </Link>
    </div>
  );
}
