import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaperFilters } from "../types/paper";
import { getPapers, type PagedResult } from "../services/paperService";
import SearchBar from "../components/filters/SearchBar";
import FilterBar from "../components/filters/FilterBar";
import { PaperTable, PaperCards } from "../components/papers/PaperList";
import { EmptyState, ErrorState, TableSkeleton } from "../components/ui/primitives";
import { useDebounced } from "../hooks/useDebounced";

function paramsToFilters(params: URLSearchParams): PaperFilters {
  const sem = params.get("semester");
  const year = params.get("year");
  return {
    q: params.get("q") ?? "",
    department: params.get("department") || undefined,
    semester: sem ? Number(sem) : "",
    examYear: year ? Number(year) : "",
    examType: params.get("type") || undefined,
    sort: (params.get("sort") as PaperFilters["sort"]) || "newest",
    page: params.get("page") ? Number(params.get("page")) : 1,
  };
}

export default function BrowsePapers() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => paramsToFilters(params), [params]);
  const [result, setResult] = useState<PagedResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(filters.q ?? "");
  const debouncedQ = useDebounced(searchInput, 350);

  // Keep the input in sync when navigating (e.g. semester cards, shared links)
  useEffect(() => {
    setSearchInput(params.get("q") ?? "");
  }, [params]);

  // Debounced search → URL (shareable links)
  useEffect(() => {
    const current = params.get("q") ?? "";
    if (debouncedQ !== current) {
      const next = new URLSearchParams(params);
      if (debouncedQ.trim()) next.set("q", debouncedQ.trim());
      else next.delete("q");
      next.delete("page");
      setParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  useEffect(() => {
    let live = true;
    setLoading(true);
    setError(null);
    getPapers(filters)
      .then((r) => {
        if (live) {
          setResult(r);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (live) {
          setError(e instanceof Error ? e.message : "Failed to load papers. Check your connection and try again.");
          setLoading(false);
        }
      });
    return () => {
      live = false;
    };
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  function patch(p: Partial<PaperFilters>) {
    const next = new URLSearchParams(params);
    const setOrDel = (k: string, v: string | number | undefined | "") => {
      if (v === undefined || v === "" || v === null) next.delete(k);
      else next.set(k, String(v));
    };
    if ("q" in p) setOrDel("q", p.q?.trim());
    if ("department" in p) setOrDel("department", p.department);
    if ("semester" in p) setOrDel("semester", p.semester);
    if ("examYear" in p) setOrDel("year", p.examYear);
    if ("examType" in p) setOrDel("type", p.examType);
    if ("sort" in p) setOrDel("sort", p.sort);
    if ("page" in p) setOrDel("page", p.page === 1 ? "" : p.page);
    else next.delete("page");
    setParams(next, { replace: false });
  }

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (filters.q?.trim()) chips.push({ key: "q", label: `“${filters.q.trim()}”`, clear: () => { setSearchInput(""); patch({ q: "" }); } });
    if (filters.department) chips.push({ key: "dept", label: filters.department, clear: () => patch({ department: undefined }) });
    if (filters.semester !== "" && filters.semester !== undefined) chips.push({ key: "sem", label: `Sem ${filters.semester}`, clear: () => patch({ semester: "" as const }) });
    if (filters.examYear !== "" && filters.examYear !== undefined) chips.push({ key: "year", label: String(filters.examYear), clear: () => patch({ examYear: "" as const }) });
    if (filters.examType) chips.push({ key: "type", label: filters.examType, clear: () => patch({ examType: undefined }) });
    return chips;
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasFilters = activeChips.length > 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">Browse papers</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Approved papers only · share this page — filters live in the URL.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
        <SearchBar value={searchInput} onChange={setSearchInput} compact />
        <div>
          <label htmlFor="sort" className="sr-only">Sort papers</label>
          <select
            id="sort"
            value={filters.sort ?? "newest"}
            onChange={(e) => patch({ sort: e.target.value as PaperFilters["sort"] })}
            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="subject">Subject A–Z</option>
            <option value="examYear">Exam year ↓</option>
          </select>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onChange={patch}
        onClear={() => {
          setSearchInput("");
          setParams({}, { replace: true });
        }}
        activeChips={activeChips}
      />

      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => setParams(new URLSearchParams(params))} />
      ) : !result || result.total === 0 ? (
        <EmptyState
          title={hasFilters ? "No papers match these filters" : "No papers yet"}
          hint={hasFilters ? "Try removing a filter or searching for a broader term like a subject code." : "Be the first to contribute — upload a paper to get started."}
          action={
            hasFilters ? (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setParams({}, { replace: true });
                }}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          <p className="text-xs text-neutral-500 dark:text-neutral-400" role="status">
            Showing {(result.page - 1) * result.pageSize + 1}–{Math.min(result.page * result.pageSize, result.total)} of{" "}
            {result.total} paper{result.total === 1 ? "" : "s"}
          </p>
          <PaperTable items={result.items} />
          <PaperCards items={result.items} />

          {result.totalPages > 1 && (
            <nav aria-label="Pagination" className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                disabled={result.page <= 1}
                onClick={() => patch({ page: result.page - 1 })}
                aria-label="Previous page"
                className="inline-flex items-center gap-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium disabled:opacity-40 dark:border-neutral-700"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden /> Prev
              </button>
              <span className="text-sm text-neutral-500" aria-current="page">
                Page {result.page} of {result.totalPages}
              </span>
              <button
                type="button"
                disabled={result.page >= result.totalPages}
                onClick={() => patch({ page: result.page + 1 })}
                aria-label="Next page"
                className="inline-flex items-center gap-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium disabled:opacity-40 dark:border-neutral-700"
              >
                Next <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
