type BrandProps = {
  variant?: "light" | "dark";
  className?: string;
  size?: "sm" | "md";
};

/**
 * Inline brand mark + wordmark for the Unitholder Portal.
 * Uses SVG, no external assets needed.
 */
export default function Brand({
  variant = "dark",
  className = "",
  size = "md",
}: BrandProps) {
  const isLight = variant === "light";
  const text = isLight ? "text-white" : "text-brand-900";
  const sub = isLight ? "text-white/50" : "text-slate-500";
  const dim = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const heading = size === "sm" ? "text-base" : "text-lg";
  const label = size === "sm" ? "text-[10px]" : "text-[11px]";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        className={`shrink-0 ${dim}`}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="10" fill="url(#brandGrad)" />
        <path
          d="M12 27V13h7.2c2.9 0 4.6 1.5 4.6 3.8 0 1.6-.9 2.7-2.3 3.2 1.7.4 2.8 1.6 2.8 3.4 0 2.4-1.8 3.6-4.8 3.6H12Zm3.3-8.4h3.2c1.2 0 1.9-.6 1.9-1.6s-.7-1.5-1.9-1.5h-3.2v3.1Zm0 5.9h3.4c1.3 0 2-.6 2-1.6 0-1.1-.7-1.6-2-1.6h-3.4v3.2Z"
          fill="white"
        />
        <circle cx="28.5" cy="14" r="2.4" fill="#14b88e" />
        <defs>
          <linearGradient id="brandGrad" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#122a4d" />
            <stop offset="1" stopColor="#1b3a66" />
          </linearGradient>
        </defs>
      </svg>
      <div className="leading-tight">
        <div className={`${heading} font-bold tracking-tight ${text}`}>
          Brookfield
        </div>
        <div
          className={`${label} font-medium uppercase tracking-[0.18em] ${sub}`}
        >
          Unitholder Portal
        </div>
      </div>
    </div>
  );
}
