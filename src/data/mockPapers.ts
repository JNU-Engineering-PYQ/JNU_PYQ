import type { Paper, PendingSubmission } from "../types/paper";

const MB = 1024 * 1024;

function mb(n: number): { fileSize: string; fileSizeBytes: number } {
  return { fileSize: `${n.toFixed(1)} MB`, fileSizeBytes: Math.round(n * MB) };
}

/**
 * Illustrative sample data only — not real university papers.
 * Public catalogue must only contain `status: "approved"` items.
 */
export const mockPapers: Paper[] = [
  { id: "cs201-2024-endsem", subjectName: "Data Structures", subjectCode: "CS201", department: "CSE", semester: 3, examYear: 2024, examType: "End-Sem", fileName: "CS201_Data_Structures_EndSem_2024.pdf", ...mb(1.4), uploadedAt: "2025-08-28T10:30:00+05:30", status: "approved", storageKey: "approved/cs201-2024-endsem.pdf", contributor: "Batch of 2026" },
  { id: "cs202-2024-endsem", subjectName: "Database Management Systems", subjectCode: "CS202", department: "CSE", semester: 4, examYear: 2024, examType: "End-Sem", fileName: "CS202_DBMS_EndSem_2024.pdf", ...mb(2.1), uploadedAt: "2025-08-25T14:00:00+05:30", status: "approved", storageKey: "approved/cs202-2024-endsem.pdf", contributor: "Batch of 2026" },
  { id: "cs203-2024-midsem", subjectName: "Operating Systems", subjectCode: "CS203", department: "CSE", semester: 4, examYear: 2024, examType: "Mid-Sem", fileName: "CS203_OS_MidSem_2024.pdf", ...mb(0.9), uploadedAt: "2025-08-22T09:15:00+05:30", status: "approved", storageKey: "approved/cs203-2024-midsem.pdf" },
  { id: "cs301-2023-endsem", subjectName: "Computer Networks", subjectCode: "CS301", department: "CSE", semester: 5, examYear: 2023, examType: "End-Sem", fileName: "CS301_Networks_EndSem_2023.pdf", ...mb(1.8), uploadedAt: "2025-08-18T16:40:00+05:30", status: "approved", storageKey: "approved/cs301-2023-endsem.pdf", contributor: "Study Circle" },
  { id: "cs302-2023-endsem", subjectName: "Theory of Computation", subjectCode: "CS302", department: "CSE", semester: 5, examYear: 2023, examType: "End-Sem", fileName: "CS302_TOC_EndSem_2023.pdf", ...mb(1.1), uploadedAt: "2025-08-15T11:00:00+05:30", status: "approved", storageKey: "approved/cs302-2023-endsem.pdf" },
  { id: "cs101-2024-endsem", subjectName: "Programming in C", subjectCode: "CS101", department: "CSE", semester: 1, examYear: 2024, examType: "End-Sem", fileName: "CS101_C_Programming_EndSem_2024.pdf", ...mb(1.6), uploadedAt: "2025-08-12T10:00:00+05:30", status: "approved", storageKey: "approved/cs101-2024-endsem.pdf" },
  { id: "ma101-2024-endsem", subjectName: "Engineering Mathematics I", subjectCode: "MA101", department: "CSE", semester: 1, examYear: 2024, examType: "End-Sem", fileName: "MA101_Maths1_EndSem_2024.pdf", ...mb(2.4), uploadedAt: "2025-08-10T12:30:00+05:30", status: "approved", storageKey: "approved/ma101-2024-endsem.pdf" },
  { id: "ph101-2023-endsem", subjectName: "Engineering Physics", subjectCode: "PH101", department: "ECE", semester: 1, examYear: 2023, examType: "End-Sem", fileName: "PH101_Physics_EndSem_2023.pdf", ...mb(1.9), uploadedAt: "2025-08-08T09:00:00+05:30", status: "approved", storageKey: "approved/ph101-2023-endsem.pdf" },
  { id: "ec201-2024-endsem", subjectName: "Digital Electronics", subjectCode: "EC201", department: "ECE", semester: 3, examYear: 2024, examType: "End-Sem", fileName: "EC201_Digital_EndSem_2024.pdf", ...mb(1.3), uploadedAt: "2025-08-05T15:20:00+05:30", status: "approved", storageKey: "approved/ec201-2024-endsem.pdf" },
  { id: "ec202-2023-midsem", subjectName: "Signals and Systems", subjectCode: "EC202", department: "ECE", semester: 4, examYear: 2023, examType: "Mid-Sem", fileName: "EC202_Signals_MidSem_2023.pdf", ...mb(0.8), uploadedAt: "2025-08-02T13:10:00+05:30", status: "approved", storageKey: "approved/ec202-2023-midsem.pdf" },
  { id: "ec204-2024-endsem", subjectName: "Network Theory", subjectCode: "EC204", department: "ECE", semester: 3, examYear: 2024, examType: "End-Sem", fileName: "EC204_Networks_EndSem_2024.pdf", ...mb(1.5), uploadedAt: "2025-07-30T10:45:00+05:30", status: "approved", storageKey: "approved/ec204-2024-endsem.pdf" },
  { id: "cs206-2023-endsem", subjectName: "Computer Organization", subjectCode: "CS206", department: "CSE", semester: 3, examYear: 2023, examType: "End-Sem", fileName: "CS206_COA_EndSem_2023.pdf", ...mb(2.0), uploadedAt: "2025-07-27T11:30:00+05:30", status: "approved", storageKey: "approved/cs206-2023-endsem.pdf" },
  { id: "ec203-2024-endsem", subjectName: "Analog Electronics", subjectCode: "EC203", department: "ECE", semester: 4, examYear: 2024, examType: "End-Sem", fileName: "EC203_Analog_EndSem_2024.pdf", ...mb(2.7), uploadedAt: "2025-07-24T09:50:00+05:30", status: "approved", storageKey: "approved/ec203-2024-endsem.pdf" },
  { id: "cs204-2025-midsem", subjectName: "Design and Analysis of Algorithms", subjectCode: "CS204", department: "CSE", semester: 4, examYear: 2025, examType: "Mid-Sem", fileName: "CS204_DAA_MidSem_2025.pdf", ...mb(0.7), uploadedAt: "2025-07-20T14:25:00+05:30", status: "approved", storageKey: "approved/cs204-2025-midsem.pdf", contributor: "Batch of 2027" },
  { id: "cs303-2024-quiz", subjectName: "Machine Learning", subjectCode: "CS303", department: "CSE", semester: 6, examYear: 2024, examType: "Quiz", fileName: "CS303_ML_Quiz2_2024.pdf", ...mb(0.4), uploadedAt: "2025-07-18T16:00:00+05:30", status: "approved", storageKey: "approved/cs303-2024-quiz.pdf" },
  { id: "cs304-2022-endsem", subjectName: "Compiler Design", subjectCode: "CS304", department: "CSE", semester: 6, examYear: 2022, examType: "End-Sem", fileName: "CS304_Compilers_EndSem_2022.pdf", ...mb(1.2), uploadedAt: "2025-07-15T10:10:00+05:30", status: "approved", storageKey: "approved/cs304-2022-endsem.pdf" },
  { id: "hu101-2024-endsem", subjectName: "Technical Communication", subjectCode: "HU101", department: "CSE", semester: 2, examYear: 2024, examType: "End-Sem", fileName: "HU101_TechComm_EndSem_2024.pdf", ...mb(0.6), uploadedAt: "2025-07-12T12:00:00+05:30", status: "approved", storageKey: "approved/hu101-2024-endsem.pdf" },
  { id: "ma201-2023-endsem", subjectName: "Probability and Statistics", subjectCode: "MA201", department: "CSE", semester: 3, examYear: 2023, examType: "End-Sem", fileName: "MA201_ProbStats_EndSem_2023.pdf", ...mb(1.7), uploadedAt: "2025-07-10T09:30:00+05:30", status: "approved", storageKey: "approved/ma201-2023-endsem.pdf" },
  { id: "cs401-2023-endsem", subjectName: "Distributed Systems", subjectCode: "CS401", department: "CSE", semester: 7, examYear: 2023, examType: "End-Sem", fileName: "CS401_Distributed_EndSem_2023.pdf", ...mb(1.0), uploadedAt: "2025-07-08T15:45:00+05:30", status: "approved", storageKey: "approved/cs401-2023-endsem.pdf" },
  { id: "ec301-2022-supp", subjectName: "Communication Theory", subjectCode: "EC301", department: "ECE", semester: 5, examYear: 2022, examType: "Supplementary", fileName: "EC301_CommTheory_Supp_2022.pdf", ...mb(1.4), uploadedAt: "2025-07-05T11:20:00+05:30", status: "approved", storageKey: "approved/ec301-2022-supp.pdf" },
  { id: "cs205-2021-endsem", subjectName: "Software Engineering", subjectCode: "CS205", department: "CSE", semester: 5, examYear: 2021, examType: "End-Sem", fileName: "CS205_SE_EndSem_2021.pdf", ...mb(1.9), uploadedAt: "2025-07-02T10:00:00+05:30", status: "approved", storageKey: "approved/cs205-2021-endsem.pdf" },
  { id: "ec303-2020-endsem", subjectName: "Microprocessors and Microcontrollers", subjectCode: "EC303", department: "ECE", semester: 5, examYear: 2020, examType: "End-Sem", fileName: "EC303_Microprocessors_EndSem_2020.pdf", ...mb(2.2), uploadedAt: "2025-06-28T09:00:00+05:30", status: "approved", storageKey: "approved/ec303-2020-endsem.pdf" },
  { id: "cs102-2025-midsem", subjectName: "Discrete Mathematics", subjectCode: "CS102", department: "CSE", semester: 2, examYear: 2025, examType: "Mid-Sem", fileName: "CS102_Discrete_MidSem_2025.pdf", ...mb(0.9), uploadedAt: "2025-06-25T13:30:00+05:30", status: "approved", storageKey: "approved/cs102-2025-midsem.pdf", contributor: "Batch of 2028" },
  { id: "ec304-2024-assign", subjectName: "Digital Signal Processing", subjectCode: "EC304", department: "ECE", semester: 6, examYear: 2024, examType: "Assignment", fileName: "EC304_DSP_Assignment_2024.pdf", ...mb(0.5), uploadedAt: "2025-06-20T16:15:00+05:30", status: "approved", storageKey: "approved/ec304-2024-assign.pdf" },
];

export const initialPending: PendingSubmission[] = [
  { id: "sub-101", subjectName: "Artificial Intelligence", subjectCode: "CS306", department: "CSE", semester: 6, examYear: 2024, examType: "End-Sem", fileName: "CS306_AI_EndSem_2024_scan.pdf", fileSize: "3.8 MB", fileSizeBytes: Math.round(3.8 * MB), uploadedAt: "2025-09-02T18:20:00+05:30", status: "pending", storageKey: "pending/sub-101.pdf", submittedBy: "Anonymous", notes: "Scanned copy, pages 3–4 slightly skewed." },
  { id: "sub-102", subjectName: "VLSI Design", subjectCode: "EC302", department: "ECE", semester: 6, examYear: 2024, examType: "End-Sem", fileName: "EC302_VLSI_EndSem_2024.pdf", fileSize: "1.1 MB", fileSizeBytes: Math.round(1.1 * MB), uploadedAt: "2025-09-01T12:05:00+05:30", status: "pending", storageKey: "pending/sub-102.pdf", submittedBy: "Priya S.", notes: "" },
  { id: "sub-103", subjectName: "Engineering Mathematics III", subjectCode: "MA203", department: "ECE", semester: 3, examYear: 2025, examType: "Mid-Sem", fileName: "MA203_Maths3_MidSem_2025.pdf", fileSize: "0.8 MB", fileSizeBytes: Math.round(0.8 * MB), uploadedAt: "2025-08-31T09:40:00+05:30", status: "pending", storageKey: "pending/sub-103.pdf", submittedBy: "Rahul V." },
];

export const initialRejected: PendingSubmission[] = [
  { id: "sub-090", subjectName: "Photos of whiteboard", subjectCode: "", department: "CSE", semester: 4, examYear: 2024, examType: "Quiz", fileName: "whiteboard-photos.pdf", fileSize: "12.4 MB", fileSizeBytes: Math.round(12.4 * MB), uploadedAt: "2025-08-20T10:00:00+05:30", status: "rejected", storageKey: "pending/sub-090.pdf", submittedBy: "Anonymous", rejectionReason: "Not a question paper — whiteboard photos without the question text. Please submit the official paper PDF." },
];

export const auditSeed = [
  { id: "a1", at: "2025-08-28T11:02:00+05:30", actor: "moderator", action: "Approved CS201 Data Structures (2024 End-Sem)" },
  { id: "a2", at: "2025-08-25T14:31:00+05:30", actor: "moderator", action: "Approved CS202 DBMS (2024 End-Sem)" },
  { id: "a3", at: "2025-08-20T10:44:00+05:30", actor: "moderator", action: "Rejected whiteboard-photos.pdf — not a question paper" },
];
