import { useEffect, useMemo, useState } from "react";
import { ShieldAlert, Check, X, Eye, Clock, FileCheck2, FileX2, Inbox, Loader2 } from "lucide-react";
import {
  getPendingSubmissions,
  getApprovedPapers,
  getRejectedSubmissions,
  getAuditLog,
  approvePaper,
  rejectPaper,
} from "../services/paperService";
import type { Paper, PendingSubmission } from "../types/paper";
import { formatDateTime } from "../lib/format";
import SearchBar from "../components/filters/SearchBar";
import { Card, StatusBadge, ExamBadge, EmptyState, Skeleton } from "../components/ui/primitives";
import ConfirmDialog from "../components/ui/ConfirmDialog";

type Tab = "pending" | "approved" | "rejected";

interface Audit {
  id: string;
  at: string;
  actor: string;
  action: string;
}

export default function Admin() {
  const [tab, setTab] = useState<Tab>("pending");
  const [pending, setPending] = useState<PendingSubmission[] | null>(null);
  const [approved, setApproved] = useState<Paper[] | null>(null);
  const [rejected, setRejected] = useState<PendingSubmission[] | null>(null);
  const [audit, setAudit] = useState<Audit[]>([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<PendingSubmission | null>(null);
  const [confirm, setConfirm] = useState<"approve" | "reject" | null>(null);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function refresh() {
    const [p, a, r, log] = await Promise.all([
      getPendingSubmissions(),
      getApprovedPapers(),
      getRejectedSubmissions(),
      getAuditLog(),
    ]);
    setPending(p);
    setApproved(a);
    setRejected(r);
    setAudit(log);
  }

  useEffect(() => {
    let live = true;
    refresh().catch(() => {});
    return () => {
      live = false;
      void live;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    setPreviewUrl(null);
    if (selected) {
      // Mock preview marker for staged (pending) files — production renders
      // the staged file from the moderation endpoint here.
      setPreviewUrl("pending-preview");
    }
  }, [selected]);

  const counts = {
    pending: pending?.length ?? 0,
    approved: approved?.length ?? 0,
    rejected: rejected?.length ?? 0,
  };

  const filteredPending = useMemo(() => {
    if (!pending) return [];
    const needle = q.trim().toLowerCase();
    if (!needle) return pending;
    return pending.filter((p) =>
      `${p.subjectName} ${p.subjectCode} ${p.department} ${p.fileName}`.toLowerCase().includes(needle),
    );
  }, [pending, q]);

  async function doApprove() {
    if (!selected) return;
    setBusy(true);
    try {
      await approvePaper(selected.id);
      await refresh();
      setToast(`Approved “${selected.subjectName}” — now visible in the public catalogue (mock).`);
      setSelected(null);
      setConfirm(null);
    } finally {
      setBusy(false);
    }
  }

  async function doReject() {
    if (!selected) return;
    if (!reason.trim()) {
      setReasonError("A reason is required so the contributor knows what to fix.");
      return;
    }
    setBusy(true);
    try {
      await rejectPaper(selected.id, reason);
      await refresh();
      setToast(`Rejected “${selected.subjectName}” with a reason (mock).`);
      setSelected(null);
      setConfirm(null);
      setReason("");
    } finally {
      setBusy(false);
    }
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "pending", label: "Pending", icon: <Clock className="h-3.5 w-3.5" aria-hidden />, count: counts.pending },
    { key: "approved", label: "Approved", icon: <FileCheck2 className="h-3.5 w-3.5" aria-hidden />, count: counts.approved },
    { key: "rejected", label: "Rejected", icon: <FileX2 className="h-3.5 w-3.5" aria-hidden />, count: counts.rejected },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">Moderator dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Review student submissions before they go public.</p>
        </div>
      </div>

      <p role="note" className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <span>
          <strong>Development mode:</strong> this dashboard uses local mock data with no authentication. Real
          deployment requires moderator sign-in plus server-side authorisation — never gate moderation on frontend code
          alone.
        </span>
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {[
          { label: "Pending review", value: counts.pending, tone: "text-amber-600" },
          { label: "Approved papers", value: counts.approved, tone: "text-emerald-600" },
          { label: "Rejected", value: counts.rejected, tone: "text-red-500" },
        ].map((c) => (
          <Card key={c.label} className="p-3.5 sm:p-4">
            <p className={`text-2xl font-extrabold ${c.tone}`}>{pending === null ? "—" : c.value}</p>
            <p className="text-xs text-neutral-500">{c.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Submission status" className="flex gap-1 rounded-xl border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-900">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-indigo-600 text-white"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-800"
            }`}
          >
            {t.icon} {t.label}
            <span className={`rounded-full px-1.5 text-xs ${tab === t.key ? "bg-white/20" : "bg-neutral-100 dark:bg-neutral-800"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {tab === "pending" && (
        <div className="space-y-3">
          <SearchBar value={q} onChange={setQ} compact placeholder="Search pending by subject, code, branch…" />
          {pending === null ? (
            <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : filteredPending.length === 0 ? (
            <EmptyState
              title={q ? "No pending submissions match" : "Queue is clear"}
              hint={q ? "Try a different search term." : "New student submissions will appear here for review."}
            />
          ) : (
            <ul className="space-y-2.5">
              {filteredPending.map((p) => (
                <li key={p.id}>
                  <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">{p.subjectName}</span>
                        <StatusBadge status={p.status} />
                        <ExamBadge type={p.examType} />
                      </div>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {p.subjectCode || "No code"} · {p.department} · Sem {p.semester} · {p.examYear} · {p.fileSize} · submitted {formatDateTime(p.uploadedAt)}
                        {p.submittedBy ? ` by ${p.submittedBy}` : ""}
                      </p>
                      <p className="truncate font-mono text-[11px] text-neutral-400">{p.fileName}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelected(p)}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-neutral-300 px-3 py-2 text-xs font-medium hover:bg-neutral-50 sm:flex-none dark:border-neutral-700 dark:hover:bg-neutral-800"
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden /> Review
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(p);
                          setReason("");
                          setReasonError("");
                          setConfirm("approve");
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700 sm:flex-none"
                      >
                        <Check className="h-3.5 w-3.5" aria-hidden /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(p);
                          setReason("");
                          setReasonError("");
                          setConfirm("reject");
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 sm:flex-none"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden /> Reject
                      </button>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "approved" && (
        <div>
          {approved === null ? (
            <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <Card className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {approved.slice(0, 12).map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <span className="min-w-0 truncate">
                    <span className="font-medium">{p.subjectName}</span>{" "}
                    <span className="text-xs text-neutral-400">{p.subjectCode} · {p.examYear} {p.examType}</span>
                  </span>
                  <StatusBadge status="approved" />
                </div>
              ))}
              <p className="px-4 py-2.5 text-xs text-neutral-400">Showing {Math.min(12, approved.length)} of {approved.length} — full list lives in the public catalogue.</p>
            </Card>
          )}
        </div>
      )}

      {tab === "rejected" && (
        <div>
          {rejected === null ? (
            <div className="space-y-2">{[0, 1].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : rejected.length === 0 ? (
            <EmptyState title="No rejections" hint="Rejected submissions will appear here with their reasons." />
          ) : (
            <ul className="space-y-2.5">
              {rejected.map((p) => (
                <li key={p.id}>
                  <Card className="p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{p.subjectName}</span>
                      <StatusBadge status="rejected" />
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">{p.fileName} · submitted {formatDateTime(p.uploadedAt)}</p>
                    {p.rejectionReason && (
                      <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
                        Reason: {p.rejectionReason}
                      </p>
                    )}
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Audit */}
      <Card className="p-4">
        <h2 className="flex items-center gap-1.5 text-sm font-bold"><Inbox className="h-4 w-4" aria-hidden /> Moderator audit history <span className="font-normal text-neutral-400">(placeholder)</span></h2>
        <ul className="mt-2 space-y-1.5">
          {audit.slice(0, 6).map((a) => (
            <li key={a.id} className="flex justify-between gap-3 text-xs">
              <span className="text-neutral-600 dark:text-neutral-300">{a.action}</span>
              <span className="shrink-0 text-neutral-400">{formatDateTime(a.at)}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Review drawer */}
      {selected && !confirm && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40" onClick={() => setSelected(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Review ${selected.subjectName}`}
            onClick={(e) => e.stopPropagation()}
            className="nice-scroll flex h-full w-full max-w-md flex-col overflow-y-auto bg-white p-5 shadow-xl dark:bg-neutral-950"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold">{selected.subjectName}</h2>
                <p className="text-xs text-neutral-500">
                  {selected.subjectCode || "No code"} · {selected.department} · Sem {selected.semester} · {selected.examYear} {selected.examType}
                </p>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close review panel" className="rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-neutral-400">File</dt><dd className="font-mono text-xs">{selected.fileName} ({selected.fileSize})</dd></div>
              <div className="flex justify-between"><dt className="text-neutral-400">Submitted</dt><dd>{formatDateTime(selected.uploadedAt)}{selected.submittedBy ? ` by ${selected.submittedBy}` : ""}</dd></div>
              {selected.notes && <div><dt className="text-neutral-400">Contributor notes</dt><dd className="mt-0.5 rounded-md bg-neutral-100 px-2 py-1.5 text-xs dark:bg-neutral-800">{selected.notes}</dd></div>}
            </dl>
            <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
              {previewUrl ? (
                <>PDF preview placeholder — production renders the staged file here.<br /><span className="font-mono">{selected.storageKey}</span></>
              ) : (
                "Loading preview…"
              )}
            </div>
            <div className="mt-auto flex gap-2 pt-5">
              <button type="button" onClick={() => { setReason(""); setReasonError(""); setConfirm("approve"); }} className="flex-1 rounded-md bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-emerald-700">
                Approve
              </button>
              <button type="button" onClick={() => { setReason(""); setReasonError(""); setConfirm("reject"); }} className="flex-1 rounded-md bg-red-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-red-700">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirm === "approve" && !!selected}
        title={`Approve “${selected?.subjectName}”?`}
        description="It will become visible in the public catalogue immediately (mock state only)."
        confirmLabel={busy ? "Approving…" : "Approve"}
        onConfirm={doApprove}
        onClose={() => setConfirm(null)}
      />

      <ConfirmDialog
        open={confirm === "reject" && !!selected}
        title={`Reject “${selected?.subjectName}”?`}
        description="The contributor will see this reason. Be specific and kind."
        confirmLabel={busy ? "Rejecting…" : "Reject"}
        danger
        onConfirm={doReject}
        onClose={() => setConfirm(null)}
      >
        <label htmlFor="reject-reason" className="mb-1 block text-xs font-medium">Rejection reason *</label>
        <textarea
          id="reject-reason"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setReasonError("");
          }}
          rows={3}
          disabled={busy}
          placeholder="e.g. Scanned pages are unreadable — please upload a clearer copy."
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        {reasonError && <p role="alert" className="mt-1 text-xs text-red-600">{reasonError}</p>}
        {busy && <Loader2 className="mt-2 h-4 w-4 animate-spin" aria-hidden />}
      </ConfirmDialog>

      {toast && (
        <div role="status" className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg bg-neutral-900 px-4 py-3 text-sm text-white shadow-xl dark:bg-white dark:text-neutral-900">
          {toast}
        </div>
      )}
    </div>
  );
}
