import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  id = "site-search",
  placeholder = "Search by subject, code, year… (e.g. DBMS, CS202, 2024)",
  compact = false,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  id?: string;
  placeholder?: string;
  compact?: boolean;
}) {
  return (
    <form
      role="search"
      aria-label="Search papers"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="w-full"
    >
      <label htmlFor={id} className="sr-only">
        Search question papers
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onChange("");
          }}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full rounded-xl border border-neutral-300 bg-white pl-9 pr-9 shadow-sm placeholder:text-neutral-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-indigo-950 ${
            compact ? "py-2 text-sm" : "py-3 text-[15px]"
          }`}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>
    </form>
  );
}
