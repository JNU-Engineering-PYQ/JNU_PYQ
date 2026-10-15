import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Download, Calendar, Building2, FileText, Hash, Loader2 } from "lucide-react";
import { getPaperById, getPapers, getDownloadUrl } from "../services/paperService";
import type { Paper } from "../types/paper";
import { formatDate, formatBytes } from "../lib/format";
import { Card, ErrorState, Skeleton, StatusBadge, ExamBadge, MissingPdf } from "../components/ui/primitives";
import PdfPreview from "../components/papers/PdfPreview";

export default function PaperDetails() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [paper, setPaper] = useState<Paper | null | undefined>(undefined);
  const [related, setRelated] = useState<Paper[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [dlError, setDlError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    setPaper(undefined);
    setDownloadUrl(null);
    setDlError(null);
    if (!id) {
      setPaper(null);
      return;
    }
    getPaperById(id).then((p) => {
      if (!live) return;
      setPaper(p);
      if (p) {
        getPapers({ department: p.department, page: 1 }).then((r) => {
          if (live) setRelated(r.items.filter((x) => x.id !== p.id && (x.semester === p.semester || x.subjectCode.slice(0, 2) === p.subjectCode.slice(0, 2))).slice(0, 4));
        });
        // Auto-start download only when explicitly requested (?download=1)
        if (searchParams.get("download") === "1") void startDownload(p.id);
      }
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function startDownload(paperId: string) {
    setDownloading(true);
    setDlError(null);
    try {
      const url = await getDownloadUrl(paperId);
      setDownloadUrl(url);
      // Trigger the actual file save
      const a = document.createElement("a");
      a.href = url;
      a.download = paper?.fileName ?? `${paperId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      setDlError(e instanceof Error ? e.message : "Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  // Resolve preview lazily (no PDF bytes until the user asks)
  useEffect(() => {
    let live = true;
    if (paper && !downloadUrl && !dlError) {
      getDownloadUrl(paper.id)
        .then((u) => {
          if (live) setDownloadUrl(u);
        })
        .catch(() => {
          /* preview stays in its graceful fallback; download button reports errors */
        });
    }
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paper]);

  if (paper === undefined) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading paper">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  }

  if (paper === null) {
    return (
      <div className="space-y-4">
        <Link to="/papers" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to results
        </Link>
        <ErrorState message="This paper doesn't exist or hasn't been approved yet. It may have been removed by a moderator." />
      </div>
    );
  }

  const rows: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <Hash className="h-3.5 w-3.5" aria-hidden />, label: "Subject code", value: paper.subjectCode || "—" },
    { icon: <Building2 className="h-3.5 w-3.5" aria-hidden />, label: "Branch", value: `${paper.department} · Semester ${paper.semester}` },
    { icon: <Calendar className="h-3.5 w-3.5" aria-hidden />, label: "Examination", value: `${paper.examYear} · ${paper.examType}` },
    { icon: <FileText className="h-3.5 w-3.5" aria-hidden />, label: "File", value: `${paper.fileName} · ${paper.fileSize} (${formatBytes(paper.fileSizeBytes)})` },
  ];

  return (
    <div className="space-y-5">
      <Link to="/papers" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to results
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">{paper.subjectName}</h1>
            <StatusBadge status={paper.status} />
            <ExamBadge type={paper.examType} />
          </div>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {paper.subjectCode || "No code"} · Uploaded {formatDate(paper.uploadedAt)}
            {paper.contributor ? ` · Shared by ${paper.contributor}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void startDownload(paper.id)}
          disabled={downloading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {downloading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Download className="h-4 w-4" aria-hidden />}
          {downloading ? "Preparing…" : "Download PDF"}
        </button>
      </div>

      {dlError && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          Download failed: {dlError}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Details</h2>
          <dl className="mt-2 space-y-3">
            {rows.map((r) => (
              <div key={r.label} className="flex gap-2.5 text-sm">
                <span className="mt-0.5 text-neutral-400">{r.icon}</span>
                <div className="min-w-0">
                  <dt className="text-xs text-neutral-400">{r.label}</dt>
                  <dd className="break-words font-medium">{r.value}</dd>
                </div>
              </div>
            ))}
          </dl>
          {paper.notes && (
            <p className="mt-3 border-t border-neutral-100 pt-3 text-xs text-neutral-500 dark:border-neutral-800">
              Note: {paper.notes}
            </p>
          )}
        </Card>

        <div>
          {paper.storageKey ? (
            <PdfPreview paper={paper} downloadUrl={downloadUrl} />
          ) : (
            <MissingPdf />
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-2 text-sm font-bold">Related papers</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  to={`/papers/${r.id}`}
                  className="block rounded-xl border border-neutral-200 bg-white px-4 py-3 hover:border-indigo-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <span className="block truncate text-sm font-semibold">{r.subjectName}</span>
                  <span className="text-xs text-neutral-500">
                    {r.subjectCode} · {r.examYear} {r.examType}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
