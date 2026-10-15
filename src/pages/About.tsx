import { Link } from "react-router-dom";
import { FolderGit2, HeartHandshake, ShieldCheck, Scale, Lock } from "lucide-react";
import { SITE } from "../lib/config";
import { Card } from "../components/ui/primitives";

export default function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">About {SITE.name}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          {SITE.name} is a community-maintained archive of previous-year question papers for {SITE.collegeName}.
          Students contribute papers they collected during their own exams so the next batch can prepare with real
          questions — no paywalls, no accounts needed to browse.
        </p>
      </div>

      <Card className="p-5" >
        <h2 id="contribute" className="flex scroll-mt-20 items-center gap-1.5 text-base font-bold">
          <HeartHandshake className="h-4 w-4 text-indigo-600" aria-hidden /> Contribution guidelines
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          <li><strong>Only upload question papers</strong> — official exam PDFs or clean scans. No notes, assignments-as-homework, or answer keys unless they are part of the paper.</li>
          <li><strong>PDF only, max 20 MB.</strong> Name files clearly, e.g. <code className="font-mono text-xs">CS201_Data_Structures_EndSem_2024.pdf</code>.</li>
          <li><strong>Check before you submit</strong> — search the catalogue first to avoid duplicates.</li>
          <li><strong>No personal data.</strong> Remove roll numbers, phone numbers or signatures from scans.</li>
          <li><strong>Respect copyright.</strong> If you are the rights holder and want a file removed, see takedown below.</li>
        </ol>
        <p className="mt-3 flex items-start gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden />
          Every submission is reviewed by a student moderator before it appears publicly.
        </p>
        <Link to="/upload" className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          Submit a PYQ
        </Link>
      </Card>

      <Card className="p-5">
        <h2 id="privacy" className="flex scroll-mt-20 items-center gap-1.5 text-base font-bold">
          <Lock className="h-4 w-4 text-indigo-600" aria-hidden /> Privacy
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-neutral-600 dark:text-neutral-300">
          <li>Browsing and downloading require no account and set no tracking cookies in this prototype.</li>
          <li>The theme preference is stored locally in your browser only.</li>
          <li>Contributor names are optional and shown only if you provide them.</li>
          <li>Future backend: uploads will be logged for abuse prevention; see the README for the data model.</li>
        </ul>
      </Card>

      <Card className="p-5">
        <h2 id="takedown" className="flex scroll-mt-20 items-center gap-1.5 text-base font-bold">
          <Scale className="h-4 w-4 text-indigo-600" aria-hidden /> Copyright / takedown requests
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          Papers are shared for study purposes. If you own the rights to a file and want it removed, email{" "}
          <a href={`mailto:${SITE.contactEmail}`} className="font-medium text-indigo-600 hover:underline">{SITE.contactEmail}</a>{" "}
          with the paper URL and proof of ownership — moderators will remove it promptly.
        </p>
        <a href={`${SITE.repoUrl}/issues`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:underline">
          <FolderGit2 className="h-4 w-4" aria-hidden /> Open an issue on GitHub
        </a>
      </Card>
    </div>
  );
}
