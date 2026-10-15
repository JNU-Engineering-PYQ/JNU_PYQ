export type PaperStatus = "approved" | "pending" | "rejected";

export type ExamType = "Mid-Sem" | "End-Sem" | "Supplementary" | "Quiz" | "Assignment";

export interface Paper {
  id: string;
  subjectName: string;
  subjectCode: string;
  department: string;
  semester: number;
  examYear: number;
  examType: ExamType;
  fileName: string;
  /** Human-readable size, e.g. "1.2 MB" */
  fileSize: string;
  /** File size in bytes (used for display + validation examples) */
  fileSizeBytes: number;
  uploadedAt: string; // ISO date
  status: PaperStatus;
  /** Opaque key for future storage (R2 object key / download id). Never a full URL. */
  storageKey: string;
  contributor?: string;
  notes?: string;
}

export interface PendingSubmission extends Paper {
  rejectionReason?: string;
  submittedBy?: string;
}

export interface PaperFilters {
  q?: string;
  department?: string;
  semester?: number | "";
  examYear?: number | "";
  examType?: string;
  sort?: "newest" | "oldest" | "subject" | "examYear";
  page?: number;
}

export interface SubmitPaperInput {
  department: string;
  semester: number;
  subjectName: string;
  subjectCode?: string;
  examYear: number;
  examType: ExamType;
  notes?: string;
  contributor?: string;
  fileName: string;
  fileSizeBytes: number;
}
