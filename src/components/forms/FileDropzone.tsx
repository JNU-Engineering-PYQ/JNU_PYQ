import { useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { formatBytes } from "../../lib/format";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from "../../lib/config";

export default function FileDropzone({
  file,
  onSelect,
  onRemove,
  error,
  disabled,
}: {
  file: File | null;
  onSelect: (f: File | null, err?: string) => void;
  onRemove: () => void;
  error?: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function validate(f: File): string | undefined {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      return "Only PDF files are accepted (.pdf).";
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      return `File is ${formatBytes(f.size)} — the limit is ${MAX_UPLOAD_MB} MB.`;
    }
    if (f.size === 0) return "This file appears to be empty.";
    return undefined;
  }

  function handle(f: File | undefined) {
    if (!f || disabled) return;
    const err = validate(f);
    onSelect(err ? null : f, err);
  }

  return (
    <div>
      {!file ? (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          aria-label="Choose a PDF file to upload"
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handle(e.dataTransfer.files?.[0]);
          }}
          className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
            dragOver
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
              : "border-neutral-300 hover:border-indigo-400 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800/50"
          } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <UploadCloud className="h-8 w-8 text-neutral-400" aria-hidden />
          <p className="mt-3 text-sm font-medium">Drag & drop your PDF here, or click to browse</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            PDF only · max {MAX_UPLOAD_MB} MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            disabled={disabled}
            className="sr-only"
            aria-label="PDF file"
            onChange={(e) => {
              handle(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/60">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-950">
            <FileText className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-neutral-500">{formatBytes(file.size)} · PDF</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            aria-label="Remove selected file"
            className="rounded-md p-2 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800 disabled:opacity-50 dark:hover:bg-neutral-700"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs font-medium hover:bg-white disabled:opacity-50 dark:border-neutral-600"
          >
            Replace
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            disabled={disabled}
            className="sr-only"
            aria-label="Replace PDF file"
            onChange={(e) => {
              handle(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      )}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
