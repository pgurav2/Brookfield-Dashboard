"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Brand from "../_components/Brand";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

function VerifyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile") ?? "";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const maskedMobile = useMemo(() => {
    if (mobile.length < 4) return mobile || "your registered number";
    return `+91 ••••• ${mobile.slice(-4)}`;
  }, [mobile]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const code = digits.join("");
  const complete = code.length === OTP_LENGTH;

  function setDigit(index: number, value: string) {
    const char = value.replace(/[^0-9]/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
    setError("");
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!complete) {
      setError("Please enter all 6 digits of the OTP.");
      return;
    }
    setVerifying(true);
    // UI-only: accept any 6-digit code and proceed to the dashboard.
    setTimeout(() => router.push("/dashboard"), 500);
  }

  function resend() {
    if (secondsLeft > 0) return;
    setDigits(Array(OTP_LENGTH).fill(""));
    setError("");
    setSecondsLeft(RESEND_SECONDS);
    inputsRef.current[0]?.focus();
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/60 ring-1 ring-slate-200 sm:p-10">
        <Brand />

        <div className="mt-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-600/10 px-3 py-1 text-xs font-medium text-accent-600">
            Step 2 of 2 · Verification
          </span>
          <h1 className="mt-4 text-2xl font-bold text-brand-900">Enter the OTP</h1>
          <p className="mt-1 text-sm text-slate-500">
            We sent a 6-digit one-time password to{" "}
            <span className="font-medium text-slate-700">{maskedMobile}</span>.
          </p>
        </div>

        <form className="mt-7" onSubmit={handleSubmit} noValidate>
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                value={digit}
                inputMode="numeric"
                maxLength={1}
                aria-label={`OTP digit ${i + 1}`}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`ring-focus h-14 w-full rounded-xl text-center text-lg font-semibold text-brand-900 outline-none ring-1 transition-shadow focus:ring-2 ${
                  error
                    ? "ring-red-400 focus:ring-red-400"
                    : "ring-slate-300 focus:ring-accent-600"
                }`}
              />
            ))}
          </div>

          {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={!complete || verifying}
            className="ring-focus mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-accent-600 text-sm font-semibold text-white transition-colors hover:bg-accent-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {verifying ? (
              <span className="flex items-center gap-2"><Spinner /> Verifying…</span>
            ) : (
              "Verify & continue"
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="ring-focus rounded-md font-medium text-slate-500 hover:text-slate-700"
          >
            ← Change details
          </button>
          <button
            type="button"
            onClick={resend}
            disabled={secondsLeft > 0}
            className="ring-focus rounded-md font-medium text-accent-600 enabled:hover:text-accent-500 disabled:text-slate-400"
          >
            {secondsLeft > 0 ? `Resend OTP in ${secondsLeft}s` : "Resend OTP"}
          </button>
        </div>
      </div>
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

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyInner />
    </Suspense>
  );
}
