"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Brand from "./_components/Brand";

type Field = "pan" | "dpClientId" | "mobile";

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const MOBILE_RE = /^[6-9][0-9]{9}$/;

export default function LoginPage() {
  const router = useRouter();

  const [values, setValues] = useState({ pan: "", dpClientId: "", mobile: "" });
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState<Record<Field, boolean>>({
    pan: false,
    dpClientId: false,
    mobile: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const errors = useMemo(() => {
    const e: Partial<Record<Field, string>> = {};
    if (!PAN_RE.test(values.pan)) e.pan = "Enter a valid 10-character PAN (e.g. ABCDE1234F).";
    if (values.dpClientId.trim().length < 8)
      e.dpClientId = "DP ID & Client ID should be at least 8 characters.";
    if (!MOBILE_RE.test(values.mobile)) e.mobile = "Enter a valid 10-digit mobile number.";
    return e;
  }, [values]);

  const isValid = Object.keys(errors).length === 0 && consent;

  function update(field: Field, raw: string) {
    let next = raw;
    if (field === "pan") next = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    if (field === "mobile") next = raw.replace(/[^0-9]/g, "").slice(0, 10);
    if (field === "dpClientId") next = raw.replace(/[^A-Za-z0-9]/g, "").slice(0, 20);
    setValues((v) => ({ ...v, [field]: next }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ pan: true, dpClientId: true, mobile: true });
    if (!isValid) return;
    setSubmitting(true);
    const params = new URLSearchParams({ mobile: values.mobile });
    router.push(`/verify?${params.toString()}`);
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/60 ring-1 ring-slate-200 md:grid-cols-2">
        {/* Branding panel */}
        <div className="relative hidden flex-col justify-between bg-brand-900 p-10 text-white md:flex">
          <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_top_right,#14b88e_0%,transparent_45%),radial-gradient(circle_at_bottom_left,#2563a8_0%,transparent_40%)]" />
          <div className="relative">
            <Brand variant="light" />
          </div>
          <div className="relative space-y-4">
            <h2 className="text-2xl font-semibold leading-snug">
              Your investments, in one secure place.
            </h2>
            <p className="text-sm leading-relaxed text-white/70">
              Access distribution advice, TDS certificates and Form 64B. Download everything
              you need as PDF, anytime.
            </p>
            <ul className="space-y-2 pt-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <Dot /> Secure OTP-based sign in
              </li>
              <li className="flex items-center gap-2">
                <Dot /> Instant document downloads
              </li>
              <li className="flex items-center gap-2">
                <Dot /> Year-wise statement history
              </li>
            </ul>
          </div>
          <p className="relative text-xs text-white/50">
            For assistance, contact your RTA.
          </p>
        </div>

        {/* Form panel */}
        <div className="p-8 sm:p-10">
          <div className="mb-6 md:hidden">
            <Brand />
          </div>
          <h1 className="text-2xl font-bold text-brand-900">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">
            Unitholders sign in with their PAN, DP/Client ID and registered mobile number.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
            <TextField
              label="PAN"
              name="pan"
              value={values.pan}
              placeholder="ABCDE1234F"
              error={touched.pan ? errors.pan : undefined}
              onChange={(v) => update("pan", v)}
              onBlur={() => setTouched((t) => ({ ...t, pan: true }))}
            />
            <TextField
              label="DP ID & Client ID"
              name="dpClientId"
              value={values.dpClientId}
              placeholder="e.g. IN300476 12345678"
              error={touched.dpClientId ? errors.dpClientId : undefined}
              onChange={(v) => update("dpClientId", v)}
              onBlur={() => setTouched((t) => ({ ...t, dpClientId: true }))}
            />
            <TextField
              label="Registered mobile number"
              name="mobile"
              inputMode="numeric"
              value={values.mobile}
              placeholder="10-digit mobile"
              prefix="+91"
              error={touched.mobile ? errors.mobile : undefined}
              onChange={(v) => update("mobile", v)}
              onBlur={() => setTouched((t) => ({ ...t, mobile: true }))}
            />

            <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 ring-1 ring-slate-200 cursor-pointer transition hover:ring-slate-300">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="ring-focus mt-0.5 h-4 w-4 accent-[var(--accent-600)]"
              />
              <span>
                I confirm I am the registered unitholder and consent to receiving a one-time
                password on my mobile.
              </span>
            </label>

            <button
              type="submit"
              disabled={!isValid || submitting}
              className="ring-focus flex h-12 w-full items-center justify-center rounded-xl bg-accent-600 text-sm font-semibold text-white transition-colors hover:bg-accent-500 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? (
                <span className="flex items-center gap-2"><Spinner /> Sending OTP…</span>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden="true" />;
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" fill="none" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

type TextFieldProps = {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  error?: string;
  prefix?: string;
  inputMode?: "text" | "numeric";
  onChange: (value: string) => void;
  onBlur?: () => void;
};

function TextField({
  label,
  name,
  value,
  placeholder,
  error,
  prefix,
  inputMode = "text",
  onChange,
  onBlur,
}: TextFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div
        className={`flex items-center overflow-hidden rounded-xl bg-white ring-1 transition-shadow focus-within:ring-2 ${
          error ? "ring-red-400 focus-within:ring-red-400" : "ring-slate-300 focus-within:ring-accent-600"
        }`}
      >
        {prefix && (
          <span className="border-r border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
            {prefix}
          </span>
        )}
        <input
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="w-full bg-transparent px-3.5 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
