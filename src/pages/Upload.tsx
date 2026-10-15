import { useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck, RotateCcw } from "lucide-react";
import { DEPARTMENTS, SEMESTERS, EXAM_YEARS, EXAM_TYPES, MAX_UPLOAD_BYTES } from "../lib/config";
import { formatBytes } from "../lib/format";
import { submitPaper } from "../services/paperService";
import type { ExamType } from "../types/paper";
import FileDropzone from "../components/forms/FileDropzone";
import { Card, FieldError, inputCls } from "../components/ui/primitives";

interface Form {
  department: string;
  semester: string;
  subjectName: string;
  subjectCode: string;
  examYear: string;
  examType: string;
  notes: string;
  contributor: string;
}

const initialForm: Form = {
  department: "",
  semester: "",
  subjectName: "",
  subjectCode: "",
  examYear: "",
  examType: "",
  notes: "",
  contributor: "",
};

export default function Upload() {
  const [form, setForm] = useState<Form>(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | undefined>();
  const [errors, setErrors] = useState<Partial<Record<keyof Form | "file", string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reference, setReference] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set<K extends keyof Form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.department) e.department = "Choose the branch or department.";
    if (!form.semester) e.semester = "Choose the semester.";
    if (form.subjectName.trim().length < 3) e.subjectName = "Enter the full subject name (min 3 characters).";
    if (form.subjectCode && !/^[A-Za-z]{2,}\d+[A-Za-z0-9-]*$/.test(form.subjectCode.trim())) {
      e.subjectCode = "Use a code like CS201 (letters followed by numbers).";
    }
    if (!form.examYear) e.examYear = "Choose the examination year.";
    if (!form.examType) e.examType = "Choose the examination type.";
    if (!file) e.file = "Attach the question-paper PDF.";
    else if (file.size > MAX_UPLOAD_BYTES) e.file = `File is ${formatBytes(file.size)} — the limit is 20 MB.`;
    if (form.notes.length > 500) e.notes = "Keep notes under 500 characters.";
    setErrors(e);
    if (!file && fileError) setErrors((prev) => ({ ...prev, file: fileError }));
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setSubmitError(null);
    setReference(null);
    if (!validate() || !file || submitting) return;
    setSubmitting(true);
    setProgress(0);
    try {
      const { referenceId } = await submitPaper(
        {
          department: form.department,
          semester: Number(form.semester),
          subjectName: form.subjectName.trim(),
          subjectCode: form.subjectCode.trim().toUpperCase() || undefined,
          examYear: Number(form.examYear),
          examType: form.examType as ExamType,
          notes: form.notes.trim() || undefined,
          contributor: form.contributor.trim() || undefined,
          fileName: file.name,
          fileSizeBytes: file.size,
        },
        file,
        setProgress,
      );
      setReference(referenceId);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setForm(initialForm);
    setFile(null);
    setFileError(undefined);
    setErrors({});
    setProgress(0);
    setReference(null);
    setSubmitError(null);
  }

  if (reference) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <Card className="p-6 text-center sm:p-8" >
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" aria-hidden />
          <h1 className="mt-3 text-lg font-extrabold">Submission received</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Thanks for contributing! A moderator will review your paper before it appears in the catalogue.
          </p>
          <p className="mx-auto mt-4 inline-block rounded-lg bg-neutral-100 px-4 py-2 font-mono text-sm font-bold dark:bg-neutral-800">
            {reference}
          </p>
          <p className="mt-2 text-xs text-neutral-400">Save this reference number to ask about your submission.</p>
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            Prototype note: this reference is simulated — no file was uploaded or stored anywhere.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Submit another
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">Submit a question paper</h1>
        <p className="mt-1 flex items-start gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
          Submissions require moderator approval before publishing — usually within a few days.
        </p>
      </div>

      <Card className="p-5 sm:p-6">
        <form onSubmit={onSubmit} noValidate aria-label="Upload a question paper">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="up-dept" className="mb-1 block text-xs font-medium">Branch / department *</label>
              <select id="up-dept" value={form.department} onChange={(e) => set("department", e.target.value)} disabled={submitting} aria-invalid={!!errors.department} aria-describedby={errors.department ? "up-dept-err" : undefined} className={inputCls(!!errors.department)}>
                <option value="">Select…</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <FieldError id="up-dept-err" message={errors.department} />
            </div>
            <div>
              <label htmlFor="up-sem" className="mb-1 block text-xs font-medium">Semester *</label>
              <select id="up-sem" value={form.semester} onChange={(e) => set("semester", e.target.value)} disabled={submitting} aria-invalid={!!errors.semester} aria-describedby={errors.semester ? "up-sem-err" : undefined} className={inputCls(!!errors.semester)}>
                <option value="">Select…</option>
                {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>
              <FieldError id="up-sem-err" message={errors.semester} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="up-subject" className="mb-1 block text-xs font-medium">Subject name *</label>
              <input id="up-subject" value={form.subjectName} onChange={(e) => set("subjectName", e.target.value)} disabled={submitting} placeholder="e.g. Data Structures" aria-invalid={!!errors.subjectName} aria-describedby={errors.subjectName ? "up-subject-err" : undefined} className={inputCls(!!errors.subjectName)} />
              <FieldError id="up-subject-err" message={errors.subjectName} />
            </div>
            <div>
              <label htmlFor="up-code" className="mb-1 block text-xs font-medium">Subject code <span className="font-normal text-neutral-400">(optional)</span></label>
              <input id="up-code" value={form.subjectCode} onChange={(e) => set("subjectCode", e.target.value)} disabled={submitting} placeholder="e.g. CS201" aria-invalid={!!errors.subjectCode} aria-describedby={errors.subjectCode ? "up-code-err" : undefined} className={`${inputCls(!!errors.subjectCode)} uppercase`} />
              <FieldError id="up-code-err" message={errors.subjectCode} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="up-year" className="mb-1 block text-xs font-medium">Exam year *</label>
                <select id="up-year" value={form.examYear} onChange={(e) => set("examYear", e.target.value)} disabled={submitting} aria-invalid={!!errors.examYear} aria-describedby={errors.examYear ? "up-year-err" : undefined} className={inputCls(!!errors.examYear)}>
                  <option value="">Select…</option>
                  {EXAM_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <FieldError id="up-year-err" message={errors.examYear} />
              </div>
              <div>
                <label htmlFor="up-type" className="mb-1 block text-xs font-medium">Exam type *</label>
                <select id="up-type" value={form.examType} onChange={(e) => set("examType", e.target.value)} disabled={submitting} aria-invalid={!!errors.examType} aria-describedby={errors.examType ? "up-type-err" : undefined} className={inputCls(!!errors.examType)}>
                  <option value="">Select…</option>
                  {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <FieldError id="up-type-err" message={errors.examType} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <span id="up-file-label" className="mb-1 block text-xs font-medium">PDF file *</span>
              <FileDropzone
                file={file}
                disabled={submitting}
                error={errors.file ?? fileError}
                onSelect={(f, err) => {
                  setFile(f);
                  setFileError(err);
                  setErrors((e) => ({ ...e, file: err }));
                }}
                onRemove={() => {
                  setFile(null);
                  setFileError(undefined);
                  setErrors((e) => ({ ...e, file: undefined }));
                }}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="up-notes" className="mb-1 block text-xs font-medium">Notes <span className="font-normal text-neutral-400">(optional)</span></label>
              <textarea id="up-notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} disabled={submitting} rows={2} maxLength={500} placeholder="e.g. Scanned copy — page 2 is slightly cropped" className={`${inputCls(!!errors.notes)} resize-y`} />
              <FieldError id="up-notes-err" message={errors.notes} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="up-by" className="mb-1 block text-xs font-medium">Your name <span className="font-normal text-neutral-400">(optional, shown as contributor)</span></label>
              <input id="up-by" value={form.contributor} onChange={(e) => set("contributor", e.target.value)} disabled={submitting} placeholder="e.g. Anonymous" autoComplete="nickname" className={inputCls()} />
            </div>
          </div>

          {submitting && (
            <div className="mt-4" role="status" aria-label="Upload progress">
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Simulating upload… {progress}%</span>
                <span>Do not close this tab</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {submitError && (
            <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {submitError}
            </p>
          )}

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={reset}
              disabled={submitting}
              className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Cancel / reset
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {submitting ? "Submitting…" : "Submit for review"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
