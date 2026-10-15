import { Link } from "react-router-dom";
import { ChevronRight, BookOpen } from "lucide-react";

export default function SemesterCard({ sem, count }: { sem: number; count?: number }) {
  return (
    <Link
      to={`/papers?semester=${sem}`}
      aria-label={`Browse Semester ${sem} papers`}
      className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-indigo-700"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950 dark:text-indigo-300">
          <BookOpen className="h-4 w-4" aria-hidden />
        </span>
        <span>
          <span className="block text-sm font-semibold">Semester {sem}</span>
          {count !== undefined && (
            <span className="block text-xs text-neutral-500 dark:text-neutral-400">{count} papers</span>
          )}
        </span>
      </span>
      <ChevronRight className="h-4 w-4 text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500" aria-hidden />
    </Link>
  );
}
