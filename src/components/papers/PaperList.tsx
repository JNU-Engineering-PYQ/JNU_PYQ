import { Link } from "react-router-dom";
import { Eye, Download, FileText } from "lucide-react";
import type { Paper } from "../../types/paper";
import { formatDate } from "../../lib/format";
import { ExamBadge } from "../ui/primitives";

function Meta({ p }: { p: Paper }) {
  return (
    <span className="text-xs text-neutral-500 dark:text-neutral-400">
      {p.department} · Sem {p.semester} · {p.examYear} · {p.fileSize} · {formatDate(p.uploadedAt)}
    </span>
  );
}

export function PaperTable({ items }: { items: Paper[] }) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-neutral-200 bg-white md:block dark:border-neutral-800 dark:bg-neutral-900">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-400 dark:border-neutral-800">
            <th scope="col" className="px-4 py-3 font-medium">Subject</th>
            <th scope="col" className="px-4 py-3 font-medium">Branch · Sem</th>
            <th scope="col" className="px-4 py-3 font-medium">Exam</th>
            <th scope="col" className="px-4 py-3 font-medium">Size · Added</th>
            <th scope="col" className="px-4 py-3 font-medium"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
              <td className="px-4 py-3">
                <Link to={`/papers/${p.id}`} className="font-medium text-neutral-900 hover:text-indigo-600 hover:underline dark:text-neutral-100">
                  {p.subjectName}
                </Link>
                <div className="text-xs text-neutral-500">{p.subjectCode || "—"}</div>
              </td>
              <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                {p.department} · Sem {p.semester}
              </td>
              <td className="px-4 py-3">
                <ExamBadge type={p.examType} /> <span className="text-neutral-600 dark:text-neutral-300">{p.examYear}</span>
              </td>
              <td className="px-4 py-3 text-xs text-neutral-500">
                {p.fileSize} · {formatDate(p.uploadedAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Link
                    to={`/papers/${p.id}`}
                    aria-label={`View ${p.subjectName}`}
                    className="rounded-md p-2 text-neutral-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950"
                  >
                    <Eye className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link
                    to={`/papers/${p.id}?download=1`}
                    aria-label={`Download ${p.subjectName}`}
                    className="rounded-md p-2 text-neutral-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PaperCards({ items }: { items: Paper[] }) {
  return (
    <ul className="space-y-2.5 md:hidden">
      {items.map((p) => (
        <li key={p.id} className="rounded-xl border border-neutral-200 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
              <FileText className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <Link to={`/papers/${p.id}`} className="block truncate text-sm font-semibold hover:text-indigo-600">
                {p.subjectName}
              </Link>
              <p className="text-xs text-neutral-500">
                {p.subjectCode || "—"} · <Meta p={p} />
              </p>
              <div className="mt-1.5">
                <ExamBadge type={p.examType} />
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Link
              to={`/papers/${p.id}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden /> View
            </Link>
            <Link
              to={`/papers/${p.id}?download=1`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
            >
              <Download className="h-3.5 w-3.5" aria-hidden /> Download
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
