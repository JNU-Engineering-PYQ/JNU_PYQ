import { mockPapers, initialPending, initialRejected, auditSeed } from "../data/mockPapers";
import type { Paper, PaperFilters, PendingSubmission, SubmitPaperInput } from "../types/paper";
import { PAGE_SIZE } from "../lib/config";
import { apiConfig } from "../lib/apiConfig";

/**
 * Frontend service boundary.
 *
 * All UI code talks to these typed functions. Today they are backed by
 * in-memory mock data with simulated latency. To integrate the real backend:
 *
 *  1. Set `VITE_API_BASE_URL` (see `.env.example`).
 *  2. Replace each function body with `fetch(apiConfig.baseUrl + path, …)`.
 *  3. Keep the same signatures so pages/components don't change.
 *
 * Future contract (Cloudflare Workers + D1 + R2):
 *  - Public catalogue returns APPROVED papers only.
 *  - Pending submissions require moderator authorisation server-side.
 *  - Downloads resolve via an approved-paper endpoint / signed R2 URL.
 *  - Uploads are validated on the server (type, size, auth, rate limits).
 */

const latency = (ms = 350) => new Promise((r) => setTimeout(r, ms));

// ---- mutable mock store (prototype only; resets on reload) ----
let approved: Paper[] = [...mockPapers];
let pending: PendingSubmission[] = [...initialPending];
let rejected: PendingSubmission[] = [...initialRejected];
let audit: { id: string; at: string; actor: string; action: string }[] = [...auditSeed];

function matches(p: Paper, f: PaperFilters): boolean {
  if (f.department && p.department !== f.department) return false;
  if (f.semester !== undefined && f.semester !== "" && p.semester !== Number(f.semester)) return false;
  if (f.examYear !== undefined && f.examYear !== "" && p.examYear !== Number(f.examYear)) return false;
  if (f.examType && p.examType !== f.examType) return false;
  if (f.q) {
    const q = f.q.trim().toLowerCase();
    if (q) {
      const hay = `${p.subjectName} ${p.subjectCode} ${p.examYear} ${p.fileName}`.toLowerCase();
      // support multi-token partial matching: every token must appear
      const tokens = q.split(/\s+/).filter(Boolean);
      if (!tokens.every((t) => hay.includes(t))) return false;
    }
  }
  return true;
}

function sortPapers(list: Paper[], sort: PaperFilters["sort"]): Paper[] {
  const arr = [...list];
  switch (sort) {
    case "oldest":
      return arr.sort((a, b) => +new Date(a.uploadedAt) - +new Date(b.uploadedAt));
    case "subject":
      return arr.sort((a, b) => a.subjectName.localeCompare(b.subjectName));
    case "examYear":
      return arr.sort((a, b) => b.examYear - a.examYear || +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
    case "newest":
    default:
      return arr.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
  }
}

export interface PagedResult {
  items: Paper[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getPapers(filters: PaperFilters = {}): Promise<PagedResult> {
  void apiConfig;
  await latency(300);
  const filtered = sortPapers(approved.filter((p) => matches(p, filters)), filters.sort ?? "newest");
  const page = Math.max(1, filters.page ?? 1);
  const start = (page - 1) * PAGE_SIZE;
  return {
    items: filtered.slice(start, start + PAGE_SIZE),
    total: filtered.length,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
  };
}

export async function getPaperById(id: string): Promise<Paper | null> {
  await latency(200);
  return approved.find((p) => p.id === id) ?? null;
}

export async function getRecentPapers(limit = 6): Promise<Paper[]> {
  await latency(250);
  return sortPapers(approved, "newest").slice(0, limit);
}

export interface SubmitResult {
  referenceId: string;
  paper: PendingSubmission;
}

/** Simulated submission — does NOT persist a file anywhere. */
export async function submitPaper(
  metadata: SubmitPaperInput,
  _file: File,
  onProgress?: (pct: number) => void,
): Promise<SubmitResult> {
  // Simulate chunked upload progress so the UI (progress bar, disabled
  // submit, cancel/reset) can be exercised without a backend.
  for (let pct = 0; pct <= 100; pct += 10) {
    onProgress?.(pct);
    await latency(120);
  }
  const referenceId = `PYQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const entry: PendingSubmission = {
    id: `sub-${Date.now()}`,
    subjectName: metadata.subjectName,
    subjectCode: metadata.subjectCode ?? "",
    department: metadata.department,
    semester: metadata.semester,
    examYear: metadata.examYear,
    examType: metadata.examType,
    fileName: metadata.fileName,
    fileSize: `${(metadata.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`,
    fileSizeBytes: metadata.fileSizeBytes,
    uploadedAt: new Date().toISOString(),
    status: "pending",
    storageKey: `pending/${referenceId}.pdf`,
    submittedBy: metadata.contributor || "Anonymous",
    notes: metadata.notes,
  };
  pending = [entry, ...pending];
  audit = [{ id: `a-${Date.now()}`, at: new Date().toISOString(), actor: "student", action: `Submitted ${metadata.subjectName} (${metadata.examYear}) for review` }, ...audit];
  return { referenceId, paper: entry };
}

export async function getPendingSubmissions(): Promise<PendingSubmission[]> {
  await latency(250);
  return [...pending];
}

export async function getApprovedPapers(): Promise<Paper[]> {
  await latency(250);
  return sortPapers([...approved], "newest");
}

export async function getRejectedSubmissions(): Promise<PendingSubmission[]> {
  await latency(250);
  return [...rejected];
}

export async function approvePaper(id: string): Promise<void> {
  await latency(300);
  const found = pending.find((p) => p.id === id);
  if (!found) throw new Error("Submission not found");
  pending = pending.filter((p) => p.id !== id);
  approved = [{ ...found, status: "approved", storageKey: `approved/${found.id}.pdf` }, ...approved];
  audit = [{ id: `a-${Date.now()}`, at: new Date().toISOString(), actor: "moderator", action: `Approved ${found.subjectName} (${found.examYear} ${found.examType})` }, ...audit];
}

export async function rejectPaper(id: string, reason: string): Promise<void> {
  await latency(300);
  if (!reason.trim()) throw new Error("A rejection reason is required");
  const found = pending.find((p) => p.id === id);
  if (!found) throw new Error("Submission not found");
  pending = pending.filter((p) => p.id !== id);
  rejected = [{ ...found, status: "rejected", rejectionReason: reason.trim() }, ...rejected];
  audit = [{ id: `a-${Date.now()}`, at: new Date().toISOString(), actor: "moderator", action: `Rejected ${found.subjectName} — ${reason.trim().slice(0, 80)}` }, ...audit];
}

/**
 * Resolve a download URL for an approved paper.
 * Mock: generates a small printable placeholder PDF on the fly so the
 * "Download PDF" button works end-to-end without any stored files.
 * Real implementation: `GET {baseUrl}/api/papers/:id/download`.
 */
export async function getDownloadUrl(id: string): Promise<string> {
  await latency(150);
  const paper = approved.find((p) => p.id === id);
  if (!paper) throw new Error("Paper not found or not approved");
  const text =
    `${paper.subjectName} (${paper.subjectCode})\n` +
    `${paper.department} · Semester ${paper.semester} · ${paper.examYear} ${paper.examType}\n\n` +
    `This is a placeholder PDF generated by the Campus PYQs frontend prototype.\n` +
    `In production this URL resolves to the approved file in R2 storage.\n`;
  const pdf = makePlaceholderPdf(text);
  const blob = new Blob([pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength) as ArrayBuffer], { type: "application/pdf" });
  return URL.createObjectURL(blob);
}

function makePlaceholderPdf(text: string): Uint8Array {
  const esc = text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/\n/g, "\\n");
  const lines = esc.split("\\n");
  let content = "BT /F1 12 Tf 50 750 Td 14 TL ";
  lines.forEach((ln, i) => {
    content += `(${ln}) Tj ${i < lines.length - 1 ? "T*" : ""} `;
  });
  content += "ET";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((obj, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => {
    pdf += `${String(o).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

export async function getAuditLog() {
  await latency(150);
  return [...audit];
}

/** Test helper — resets the mock store. Not part of the future API. */
export function __resetMock() {
  approved = [...mockPapers];
  pending = [...initialPending];
  rejected = [...initialRejected];
  audit = [...auditSeed];
}
