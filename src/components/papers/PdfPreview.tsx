import { Suspense, lazy, useState } from "react";
import { FileText, ExternalLink, AlertTriangle } from "lucide-react";
import { MissingPdf, Skeleton } from "../ui/primitives";
import type { Paper } from "../../types/paper";

const LazyObject = lazy(async () => {
  await new Promise((r) => setTimeout(r, 200));
  return {
    default: ({ url, title }: { url: string; title: string }) => (
      <object data={url} type="application/pdf" title={title} className="h-full w-full">
        <p className="p-4 text-sm text-neutral-500">
          Preview not supported in this browser. <a href={url} download className="text-indigo-600 underline">Download the PDF</a> instead.
        </p>
      </object>
    ),
  };
});

/**
 * Placeholder preview: renders a document-styled mock so the layout can be
 * reviewed without real files. Distinguishes "no file configured" (MissingPdf)
 * from a load failure (error panel).
 */
export default function PdfPreview({ paper, downloadUrl }: { paper: Paper; downloadUrl: string | null }) {
  const [failed, setFailed] = useState(false);

  if (!paper.storageKey) {
    return <MissingPdf title="No file attached" />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5 dark:border-neutral-800">
        <span className="flex min-w-0 items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate font-mono">{paper.fileName}</span>
          <span aria-hidden>·</span>
          <span>{paper.fileSize}</span>
        </span>
        {downloadUrl && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-2 inline-flex shrink-0 items-center gap-1 text-xs font-medium text-indigo-600 hover:underline"
          >
            <ExternalLink className="h-3 w-3" aria-hidden /> Open
          </a>
        )}
      </div>

      {failed || !downloadUrl ? (
        <div role="alert" className="flex flex-col items-center px-6 py-10 text-center">
          <AlertTriangle className="h-6 w-6 text-amber-500" aria-hidden />
          <p className="mt-2 text-sm font-semibold">Preview failed to load</p>
          <p className="mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
            {!downloadUrl
              ? "The storage URL is unavailable right now. The file may still download correctly — try the download button."
              : "The preview request failed (this can mean the file is missing or the network dropped). Try downloading instead."}
          </p>
          <button
            type="button"
            onClick={() => setFailed(false)}
            className="mt-3 rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Retry preview
          </button>
        </div>
      ) : (
        <div className="nice-scroll h-[420px] bg-neutral-100 sm:h-[520px] dark:bg-neutral-800/60" onError={() => setFailed(true)}>
          {/* Mock document look behind the real object for instant feedback */}
          <div className="pointer-events-none absolute" aria-hidden />
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <LazyObject url={downloadUrl} title={`${paper.subjectName} PDF preview`} />
          </Suspense>
        </div>
      )}
      <p className="border-t border-neutral-200 px-4 py-2 text-[11px] text-neutral-400 dark:border-neutral-800">
        Preview is illustrative in this prototype — production loads the approved file from controlled storage.
      </p>
    </div>
  );
}
