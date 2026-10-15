import { Link } from "react-router-dom";
import { FolderGit2, FileText } from "lucide-react";
import { SITE } from "../../lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">
              <FileText className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="text-sm font-bold">{SITE.name}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            A community-maintained archive of previous-year question papers for {SITE.collegeName} students. Shared by
            students, for students.
          </p>
          <a
            href={SITE.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-indigo-600 dark:text-neutral-300"
          >
            <FolderGit2 className="h-4 w-4" aria-hidden /> GitHub repository
          </a>
        </div>
        <nav aria-label="Footer">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Project</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-300" to="/about">About</Link></li>
            <li><Link className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-300" to="/about#contribute">Contribution guidelines</Link></li>
            <li><Link className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-300" to="/upload">Submit a paper</Link></li>
            <li><Link className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-300" to="/admin">Moderator dashboard</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Support</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-300" href={`${SITE.repoUrl}/issues`}>Report an issue</a></li>
            <li><Link className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-300" to="/about#privacy">Privacy</Link></li>
            <li><Link className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-300" to="/about#takedown">Copyright / takedown requests</Link></li>
            <li><a className="text-neutral-600 hover:text-indigo-600 dark:text-neutral-300" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-200 dark:border-neutral-800">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-neutral-500 sm:px-6 dark:text-neutral-400">
          © {new Date().getFullYear()} {SITE.name} · {SITE.collegeName} student community project. Sample data is
          illustrative only.
        </p>
      </div>
    </footer>
  );
}
