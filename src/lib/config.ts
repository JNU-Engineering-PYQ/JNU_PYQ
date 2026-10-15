import type { ExamType } from "../types/paper";

export const SITE = {
  name: "JNU B.Tech PYQs",
  tagline: "Find previous-year question papers shared by students, for students.",
  collegeName: "Jawaharlal Nehru University", // configurable placeholder
  repoUrl: "https://github.com/example/campus-pyqs", // configurable placeholder
  contactEmail: "pyqs-support@example.edu", // configurable placeholder
} as const;

export const DEPARTMENTS = ["CSE", "ECE"] as const;

export const SEMESTERS: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

export const EXAM_YEARS: number[] = [2025, 2024, 2023, 2022, 2021, 2020];

export const EXAM_TYPES: ExamType[] = ["Mid-Sem", "End-Sem", "Supplementary", "Quiz", "Assignment"];

export const MAX_UPLOAD_MB = 20;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

export const PAGE_SIZE = 10;

export const ACCEPTED_MIME = "application/pdf";
