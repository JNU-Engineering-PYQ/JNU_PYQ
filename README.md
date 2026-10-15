# JNU B.Tech PYQs — Community Previous-Year Question Paper Portal (Frontend)

A clean, minimal, responsive frontend for a student-maintained Previous Year Question Paper (PYQ) repository.
Browse and download past papers, submit new PDFs for moderator review, and help the next batch prepare.

> **Frontend-only phase.** There is no backend, database, auth server, or file storage here. All data comes from
> typed mock modules behind a service boundary (`src/services/paperService.ts`) so the real API can be plugged in
> later without touching UI code.

## Tech stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 (+ `@tailwindcss/vite`)
- `react-router-dom` (**HashRouter** — works on static hosting with zero config)
- `lucide-react` icons, no other runtime libraries

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-checks (tsc -b) then emits dist/
npm run preview  # serve dist/ locally
```

No environment variables are needed — the app runs in mock mode by default. See `.env.example` for future keys.

## Routes

| Route | Page |
|---|---|
| `/` (`#/`) | Homepage — hero search, quick filters, semester grid, recent papers, contribution CTA |
| `/papers` | Catalogue — search, 4 filters, sort, pagination; state lives in URL query params for shareable links |
| `/papers/:id` | Paper details — metadata, lazy PDF preview, download, related papers |
| `/upload` | Submission form — validation, 20 MB PDF limit, progress UI, simulated reference number |
| `/admin` | Moderator dashboard (mock) — pending/approved/rejected, review drawer, audit placeholder |
| `/about` | About, contribution guidelines, privacy, takedown |

Because HashRouter is used, URLs look like `/#/papers?semester=3`. This is deliberate for static hosting.

## Project structure

```
src/
  components/
    layout/   Navbar, Footer, Layout (+ skip link, mobile menu)
    filters/  SearchBar, FilterBar (selects + active-filter chips)
    papers/   PaperList (desktop table / mobile cards), SemesterCard, PdfPreview (lazy)
    forms/    FileDropzone (drag-drop, PDF-only, 20 MB)
    ui/       Card, badges, skeletons, empty/error states, ConfirmDialog, inputs
  pages/      Home, BrowsePapers, PaperDetails, Upload, Admin, About, NotFound
  data/       mockPapers.ts (24 approved + pending/rejected + audit seeds)
  services/   paperService.ts — typed boundary: getPapers, getPaperById,
              getRecentPapers, submitPaper, getPendingSubmissions,
              approvePaper, rejectPaper, getDownloadUrl, getAuditLog
  types/      paper.ts (Paper, PendingSubmission, PaperFilters, SubmitPaperInput)
  hooks/      useTheme (dark/light, persisted), useDebounced
  lib/        config.ts (college name, repo URL, semesters, limits),
              format.ts, apiConfig.ts (single future-API config point)
```

## Key behaviours (all working on mock data)

- Case-insensitive multi-token search over subject / code / year / filename
- Combinable branch + semester + year + type filters with chips + clear-all
- Sort (newest / oldest / subject / exam year), pagination (10/page), empty/loading/error states
- Semester cards deep-link to `/papers?semester=N`
- Theme toggle persisted to `localStorage` only (no auth/data stored there)
- Upload: PDF-only, 20 MB cap, inline errors, progress bar, duplicate-submit guard, cancel/reset
- Admin: approve/reject updates local mock state with toasts; rejection requires a reason
- PDFs are never fetched until view/download; downloads generate a small placeholder PDF client-side

## Configuration

Edit `src/lib/config.ts`:

- `SITE.collegeName`, `SITE.repoUrl`, `SITE.contactEmail`
- `DEPARTMENTS`, `SEMESTERS`, `EXAM_YEARS`, `MAX_UPLOAD_MB`, `PAGE_SIZE`

## Deploying to GitHub Pages

HashRouter needs no server rewrites — any static host serves `index.html` and the `#/...` route resolves client-side,
so refreshes and direct links always work.

```bash
npm run build
# deploy dist/ via the `gh-pages` branch, a GitHub Action, or `gh-pages` npm package
```

If this repo is a **project site** (`https://<user>.github.io/<repo>/`), `vite.config.ts` already sets `base: './'`
so asset paths stay relative. For a **user/org site** (`https://<user>.github.io/`) that is also fine.

> Prefer clean URLs (`/papers` instead of `/#/papers`)? Switch `HashRouter` → `BrowserRouter` in `src/App.tsx`,
> then add a `404.html` copy of the built `index.html` (standard GitHub Pages SPA fallback) so refreshes work.

## Connecting the future backend (Workers + D1 + R2)

Planned architecture:

1. **GitHub Pages** — this static frontend.
2. **Cloudflare Workers** — API + secure upload orchestration.
3. **Cloudflare D1** — paper metadata, submission status, audit records.
4. **Cloudflare R2** — PDF storage (private bucket, served via approved-paper endpoint / signed URLs).

Integration contract (already encoded in `paperService.ts` signatures):

- Public catalogue returns **approved papers only** (`GET /api/papers?...`).
- Pending submissions require moderator auth (`GET /api/submissions?status=pending` + `Authorization` header).
- Uploads are validated server-side (MIME, size, auth, rate limits); the worker returns a submission reference.
- Downloads resolve via `GET /api/papers/:id/download` (redirect or signed R2 URL), never raw bucket URLs in the bundle.
- Moderator actions (`POST /api/submissions/:id/approve|reject`) require server-side authorisation.
- UI already handles API failure / rate-limit / missing-file states gracefully — keep those paths when swapping implementations.

Steps:

1. Set `VITE_API_BASE_URL` (see `.env.example`) and implement the worker endpoints above.
2. Replace each `paperService.ts` function body with `fetch(...)` calls; **keep the signatures**.
3. Set `VITE_USE_MOCK=false`. No page or component changes should be necessary.
4. Keep secrets (R2 keys, D1 IDs, auth issuers) server-side only — never add `VITE_*` secrets.

## Accessibility & performance notes

- Semantic landmarks, skip link, labelled inputs, `role="alert/status"` on feedback, focus-visible rings, ESC-to-close dialogs, keyboard-operable dropzone.
- `prefers-reduced-motion` disables transitions; contrast-checked indigo-on-white; no horizontal overflow on mobile.
- Lazy PDF preview, debounced search, paginated lists, no heavy dependencies.

## Sample data disclaimer

All papers in `src/data/mockPapers.ts` are illustrative placeholders (generic subjects like “Data Structures / CS201”),
not real university papers. Placeholder PDFs generated for download are marked as such inside the file.
