"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Brand from "../_components/Brand";

/* ---------- Data types ---------- */
type Availability = Record<string, (number | null)[]>;

type DocCategory = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  quarterly: boolean;
  comingSoon?: boolean;
  note?: string;
  data: Availability;
};

/* ---------- Mock data ---------- */
const FINANCIAL_YEARS = ["FY 26", "FY 25", "FY 24"];

const CATEGORIES: DocCategory[] = [
  {
    id: "distribution-advice",
    title: "Distribution Advice",
    description: "Quarter-wise distribution advice for each financial year.",
    quarterly: true,
    icon: <IconDistribution />,
    data: {
      "FY 26": [1, null, null, null],
      "FY 25": [1, 1, 1, 1],
      "FY 24": [1, 1, 1, 1],
    },
  },
  {
    id: "tds-certificates",
    title: "TDS Certificates",
    description: "Form 16A / 13 TDS certificates, downloadable per quarter.",
    quarterly: true,
    icon: <IconTds />,
    data: {
      "FY 26": [1, null, 1, 1],
      "FY 25": [1, 1, 1, 1],
      "FY 24": [1, 1, null, 1],
    },
  },
  {
    id: "form-64b",
    title: "Form 64B & Additional Info",
    description: "Annual Form 64B statement and additional information.",
    quarterly: false,
    comingSoon: true,
    note: "From FY 2024-25 onwards, Form 64B is system generated and downloaded from the income tax portal.",
    icon: <IconForm />,
    data: {
      "FY 26": [null, null, null, null],
      "FY 25": [null, null, null, null],
      "FY 24": [1, null, null, null],
    },
  },
];

/* ---------- Page ---------- */
export default function DashboardPage() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(FINANCIAL_YEARS[0]);
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].id);
  const [downloading, setDownloading] = useState<string | null>(null);

  const activeCategory = useMemo(
    () => CATEGORIES.find((c) => c.id === activeTab) ?? CATEGORIES[0],
    [activeTab],
  );

  function download(categoryId: string, label: string) {
    const key = `${categoryId}-${label}`;
    setDownloading(key);
    setTimeout(() => setDownloading(null), 900);
  }

  const quarters = activeCategory.data[selectedYear] ?? [null, null, null, null];
  const availableCount = quarters.filter(Boolean).length;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {/* --- Top bar --- */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Brand size="sm" />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-semibold text-brand-900">Saurabh Jain</div>
              <div className="text-xs text-slate-500">DP: IN300476 · ****5678</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-900 text-sm font-semibold text-white">
              SJ
            </div>
            <button
              onClick={() => router.push("/")}
              className="ring-focus rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {/* Welcome bar + year filter */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-900">Document access</h1>
            <p className="mt-1 text-sm text-slate-500">
              View and download your statements in PDF format.
            </p>
          </div>
          <div className="w-full sm:w-44">
            <label htmlFor="year" className="mb-1.5 block text-xs font-medium text-slate-500">
              Financial year
            </label>
            <div className="relative">
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="ring-focus w-full appearance-none rounded-xl bg-white py-2.5 pl-3.5 pr-10 text-sm font-medium text-brand-900 ring-1 ring-slate-300 outline-none transition focus:ring-2 focus:ring-accent-600"
              >
                {FINANCIAL_YEARS.map((fy) => (
                  <option key={fy} value={fy}>
                    {fy}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* --- Category cards --- */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const count = (cat.data[selectedYear] ?? []).filter(Boolean).length;
            const isActive = cat.id === activeTab;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`ring-focus rounded-2xl p-5 text-left transition-all ${
                  isActive
                    ? "bg-brand-900 text-white shadow-lg shadow-brand-900/20"
                    : "bg-white text-brand-900 ring-1 ring-slate-200 hover:ring-slate-300"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isActive ? "bg-white/15 text-white" : "bg-accent-600/10 text-accent-600"
                  }`}
                >
                  {cat.icon}
                </div>
                <div className="mt-3 font-semibold">{cat.title}</div>
                <p
                  className={`mt-1 text-xs leading-relaxed ${
                    isActive ? "text-white/70" : "text-slate-500"
                  }`}
                >
                  {cat.description}
                </p>
                <div
                  className={`mt-3 inline-flex items-center gap-1.5 text-xs font-medium ${
                    isActive ? "text-accent-500" : "text-accent-600"
                  }`}
                >
                  {cat.comingSoon && count === 0
                    ? "Coming soon"
                    : `${count} document${count === 1 ? "" : "s"} · ${selectedYear}`}
                </div>
              </button>
            );
          })}
        </div>

        {/* --- Detail panel --- */}
        <section className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-brand-900">{activeCategory.title}</h2>
              <p className="text-xs text-slate-500">{selectedYear}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              PDF
            </span>
          </div>

          {activeCategory.comingSoon && availableCount === 0 ? (
            <EmptyState note={activeCategory.note} />
          ) : availableCount === 0 ? (
            <EmptyState message={`No documents available for ${selectedYear}.`} />
          ) : activeCategory.quarterly ? (
            <div className="divide-y divide-slate-100">
              {/* Header row */}
              <div className="hidden grid-cols-[1.5fr_repeat(4,1fr)] gap-2 px-5 py-3 text-xs font-medium uppercase tracking-wide text-slate-400 sm:grid">
                <span>Document</span>
                <span className="text-center">Q1</span>
                <span className="text-center">Q2</span>
                <span className="text-center">Q3</span>
                <span className="text-center">Q4</span>
              </div>
              {/* Data row */}
              <div className="grid grid-cols-2 items-center gap-3 px-5 py-4 sm:grid-cols-[1.5fr_repeat(4,1fr)]">
                <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
                  <FilePdfIcon />
                  <div>
                    <div className="text-sm font-medium text-brand-900">
                      {activeCategory.title}
                    </div>
                    <div className="text-xs text-slate-500">{selectedYear}</div>
                  </div>
                </div>
                {quarters.map((val, qi) => {
                  const label = `Q${qi + 1}`;
                  const key = `${activeCategory.id}-${label}`;
                  return (
                    <div key={qi} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-medium uppercase text-slate-400 sm:hidden">
                        {label}
                      </span>
                      {val ? (
                        <button
                          onClick={() => download(activeCategory.id, label)}
                          disabled={downloading === key}
                          className="ring-focus flex h-9 w-9 items-center justify-center rounded-full bg-accent-600 text-white transition-colors hover:bg-accent-500 disabled:bg-slate-300"
                          aria-label={`Download ${activeCategory.title} ${label} ${selectedYear}`}
                        >
                          {downloading === key ? <Spinner /> : <DownloadIcon />}
                        </button>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <FilePdfIcon />
                <div>
                  <div className="text-sm font-medium text-brand-900">
                    {activeCategory.title}
                  </div>
                  <div className="text-xs text-slate-500">{selectedYear}</div>
                </div>
              </div>
              <button
                onClick={() => download(activeCategory.id, "annual")}
                disabled={downloading === `${activeCategory.id}-annual`}
                className="ring-focus flex items-center gap-2 rounded-xl bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-500 disabled:bg-slate-300"
              >
                {downloading === `${activeCategory.id}-annual` ? <Spinner /> : <DownloadIcon />}
                Download
              </button>
            </div>
          )}

          {activeCategory.note && availableCount > 0 && (
            <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
              {activeCategory.note}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function EmptyState({ message, note }: { message?: string; note?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <IconForm />
      </div>
      <p className="text-sm font-medium text-slate-600">{message ?? "Coming soon"}</p>
      {note && <p className="max-w-md text-xs text-slate-400">{note}</p>}
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" fill="none" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilePdfIcon() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M14 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function IconDistribution() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IconTds() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IconForm() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
