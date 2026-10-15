import type { ReactNode } from "react";
import { SearchX, AlertTriangle, FileWarning } from "lucide-react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04)] dark:border-neutral-800 dark:bg-neutral-900 ${className}`}>
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800",
    pending: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800",
    rejected: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-800",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${map[status] ?? "bg-neutral-100 text-neutral-600"}`}>
      {status}
    </span>
  );
}

export function ExamBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
      {type}
    </span>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800 ${className}`} />;
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Loading papers" className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function EmptyState({
  title = "No papers found",
  hint = "Try a different search or clear the filters.",
  action,
}: {
  title?: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-neutral-300 px-6 py-12 text-center dark:border-neutral-700">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
        <SearchX className="h-5 w-5 text-neutral-400" aria-hidden />
      </span>
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">{hint}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900 dark:bg-red-950/40">
      <AlertTriangle className="h-6 w-6 text-red-500" aria-hidden />
      <h3 className="mt-3 text-sm font-semibold text-red-800 dark:text-red-200">Something went wrong</h3>
      <p className="mt-1 max-w-md text-sm text-red-700 dark:text-red-300">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function MissingPdf({ title = "Preview unavailable" }: { title?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
      <FileWarning className="h-7 w-7 text-neutral-400" aria-hidden />
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
        No preview file is attached to this record yet. Use “Download PDF” when a file becomes available, or report the
        missing file so a moderator can fix it.
      </p>
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
      {message}
    </p>
  );
}

export function inputCls(invalid = false): string {
  return `w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-neutral-400 dark:bg-neutral-900 ${
    invalid
      ? "border-red-400 focus:border-red-500 dark:border-red-700"
      : "border-neutral-300 focus:border-indigo-500 dark:border-neutral-700 dark:focus:border-indigo-400"
  } focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950`;
}
