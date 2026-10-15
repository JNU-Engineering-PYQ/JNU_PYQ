import { DEPARTMENTS, SEMESTERS, EXAM_YEARS, EXAM_TYPES } from "../../lib/config";
import type { PaperFilters } from "../../types/paper";

export interface FilterChips {
  key: string;
  label: string;
  clear: () => void;
}

function Select({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly (string | number)[];
  allLabel: string;
}) {
  const id = `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-indigo-950"
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={String(o)} value={String(o)}>
            {String(o)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function FilterBar({
  filters,
  onChange,
  onClear,
  activeChips,
  compact = false,
}: {
  filters: PaperFilters;
  onChange: (patch: Partial<PaperFilters>) => void;
  onClear: () => void;
  activeChips: FilterChips[];
  compact?: boolean;
}) {
  return (
    <div>
      <div className={`grid grid-cols-2 gap-3 ${compact ? "sm:grid-cols-4" : "sm:grid-cols-4"}`}>
        <Select
          label="Branch"
          value={filters.department ?? ""}
          onChange={(v) => onChange({ department: v || undefined })}
          options={DEPARTMENTS}
          allLabel="All branches"
        />
        <Select
          label="Semester"
          value={filters.semester === "" || filters.semester === undefined ? "" : String(filters.semester)}
          onChange={(v) => onChange({ semester: v === "" ? "" : Number(v) })}
          options={SEMESTERS}
          allLabel="All sems"
        />
        <Select
          label="Exam year"
          value={filters.examYear === "" || filters.examYear === undefined ? "" : String(filters.examYear)}
          onChange={(v) => onChange({ examYear: v === "" ? "" : Number(v) })}
          options={EXAM_YEARS}
          allLabel="All years"
        />
        <Select
          label="Exam type"
          value={filters.examType ?? ""}
          onChange={(v) => onChange({ examType: v || undefined })}
          options={EXAM_TYPES}
          allLabel="All types"
        />
      </div>
      {activeChips.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5" aria-label="Active filters">
          {activeChips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={c.clear}
              aria-label={`Remove filter ${c.label}`}
              title="Remove filter"
              className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:ring-indigo-800"
            >
              {c.label} <span aria-hidden>×</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-neutral-500 underline-offset-2 hover:underline dark:text-neutral-400"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
