import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FileText, Menu, X, Sun, Moon, Upload } from "lucide-react";
import { SITE } from "../../lib/config";
import { useTheme } from "../../hooks/useTheme";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/papers", label: "Browse Papers" },
  { to: "/upload", label: "Upload PYQ" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const location = useLocation();

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
      <nav aria-label="Primary" className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2" aria-label={`${SITE.name} home`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <FileText className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-[15px] font-bold tracking-tight">{SITE.name}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
          </button>
          <Link
            to="/upload"
            className="hidden items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 sm:inline-flex"
          >
            <Upload className="h-3.5 w-3.5" aria-hidden /> Submit a PYQ
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 md:hidden dark:text-neutral-300 dark:hover:bg-neutral-800"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-neutral-200 bg-white px-4 py-2 md:hidden dark:border-neutral-800 dark:bg-neutral-950">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2.5 text-sm font-medium ${
                  isActive || location.pathname === l.to
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "text-neutral-700 dark:text-neutral-200"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/upload"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center justify-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-medium text-white"
          >
            <Upload className="h-4 w-4" aria-hidden /> Submit a PYQ
          </Link>
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2.5 text-sm text-neutral-500 dark:text-neutral-400"
          >
            Moderator dashboard →
          </Link>
        </div>
      )}
    </header>
  );
}
