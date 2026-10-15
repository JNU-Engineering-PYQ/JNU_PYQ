import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="font-mono text-sm text-neutral-400">404</p>
      <h1 className="mt-2 text-xl font-extrabold">Page not found</h1>
      <p className="mt-1 text-sm text-neutral-500">The page you’re looking for doesn’t exist or moved.</p>
      <Link to="/" className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
        Go home
      </Link>
    </div>
  );
}
