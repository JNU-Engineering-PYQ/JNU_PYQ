import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Upload, ShieldCheck, Search } from "lucide-react";
import { SITE, SEMESTERS } from "../lib/config";
import { getRecentPapers } from "../services/paperService";
import type { Paper, PaperFilters } from "../types/paper";
import SearchBar from "../components/filters/SearchBar";
import FilterBar from "../components/filters/FilterBar";
import SemesterCard from "../components/papers/SemesterCard";
import { PaperTable, PaperCards } from "../components/papers/PaperList";
import { Skeleton, Card } from "../components/ui/primitives";
import { mockPapers } from "../data/mockPapers";

const counts = (() => {
  const m = new Map<number, number>();
  mockPapers.forEach((p) => m.set(p.semester, (m.get(p.semester) ?? 0) + 1));
  return m;
})();

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<PaperFilters>({});
  const [recent, setRecent] = useState<Paper[] | null>(null);

  useEffect(() => {
    let live = true;
    getRecentPapers(6).then((r) => {
      if (live) setRecent(r);
    });
    return () => {
      live = false;
    };
  }, []);

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (filters.department) chips.push({ key: "dept", label: filters.department, clear: () => setFilters((f) => ({ ...f, department: undefined })) });
    if (filters.semester !== undefined && filters.semester !== "") chips.push({ key: "sem", label: `Sem ${filters.semester}`, clear: () => setFilters((f) => ({ ...f, semester: "" as const })) });
    if (filters.examYear !== undefined && filters.examYear !== "") chips.push({ key: "year", label: String(filters.examYear), clear: () => setFilters((f) => ({ ...f, examYear: "" as const })) });
    if (filters.examType) chips.push({ key: "type", label: filters.examType, clear: () => setFilters((f) => ({ ...f, examType: undefined })) });
    return chips;
  }, [filters]);

  function goToCatalogue() {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (filters.department) params.set("department", filters.department);
    if (filters.semester !== undefined && filters.semester !== "") params.set("semester", String(filters.semester));
    if (filters.examYear !== undefined && filters.examYear !== "") params.set("year", String(filters.examYear));
    if (filters.examType) params.set("type", filters.examType);
    navigate(`/papers${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <div className="space-y-10">
      {/* Hero — compact */}
      <section aria-labelledby="hero-heading" className="pt-2 text-center sm:pt-4">
        <p className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
          Community-maintained · {SITE.collegeName}
        </p>
        <h1 id="hero-heading" className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          Every Past Paper. One Place.
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-[15px] text-neutral-500 dark:text-neutral-400">{SITE.tagline}</p>
        <div className="mx-auto mt-5 max-w-xl">
          <SearchBar value={q} onChange={setQ} onSubmit={goToCatalogue} />
          <p className="mt-2 text-xs text-neutral-400">Search by subject, code, year or title — press Enter to browse.</p>
        </div>
      </section>

      {/* Quick filters */}
      <section aria-label="Quick filters">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold">Find papers fast</h2>
            <button
              type="button"
              onClick={goToCatalogue}
              className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
            >
              <Search className="h-3.5 w-3.5" aria-hidden /> Search
            </button>
          </div>
          <div className="mt-3">
            <FilterBar
              filters={filters}
              onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
              onClear={() => {
                setFilters({});
                setQ("");
              }}
              activeChips={activeChips}
              compact
            />
          </div>
        </Card>
      </section>

      {/* Browse by semester */}
      <section aria-labelledby="sem-heading">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="sem-heading" className="text-base font-bold tracking-tight">Browse by semester</h2>
          <Link to="/papers" className="text-xs font-medium text-indigo-600 hover:underline">View all papers</Link>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {SEMESTERS.map((s) => (
            <SemesterCard key={s} sem={s} count={counts.get(s) ?? 0} />
          ))}
        </div>
      </section>

      {/* Recently added */}
      <section aria-labelledby="recent-heading">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="recent-heading" className="text-base font-bold tracking-tight">Recently added</h2>
          <Link to="/papers?sort=newest" className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline">
            View all papers <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
        {recent === null ? (
          <div className="space-y-2" role="status" aria-label="Loading recent papers">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <>
            <PaperTable items={recent} />
            <PaperCards items={recent} />
          </>
        )}
        <p className="mt-2 text-xs text-neutral-400">Only moderator-approved papers appear here.</p>
      </section>

      {/* Contribution CTA */}
      <section aria-labelledby="cta-heading">
        <Card className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 id="cta-heading" className="text-base font-bold tracking-tight">Have a paper we’re missing?</h2>
            <p className="mt-1 max-w-lg text-sm text-neutral-500 dark:text-neutral-400">
              Help the next batch prepare by contributing a previous-year question paper.
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-400">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Submissions are reviewed by moderators before publishing.
            </p>
          </div>
          <Link
            to="/upload"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Upload className="h-4 w-4" aria-hidden /> Submit a PYQ
          </Link>
        </Card>
      </section>
    </div>
  );
}
