'use client';

import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastTone = 'success' | 'info' | 'error';

type ToastProps = {
  readonly message: string;
  readonly tone?: ToastTone;
  readonly onDismiss: () => void;
  readonly durationMs?: number;
};

/**
 * Fixed toast aligned with dashboard brand; auto-dismisses.
 */
export default function Toast({
  message,
  tone = 'success',
  onDismiss,
  durationMs = 4800,
}: ToastProps) {
  useEffect(() => {
    const t = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(t);
  }, [durationMs, onDismiss]);

  const Icon =
    tone === 'error' ? AlertCircle : tone === 'info' ? Info : CheckCircle2;
  const styles =
    tone === 'error'
      ? 'border-red-200 bg-red-50 text-red-900 shadow-lg'
      : tone === 'info'
        ? 'border-border-soft bg-white text-foreground shadow-lg'
        : 'border-emerald-200 bg-emerald-50 text-emerald-950 shadow-lg';

  return (
    <div
      role="status"
      className={`fixed bottom-6 left-1/2 z-[120] w-[min(100%-2rem,28rem)] -translate-x-1/2 rounded-2xl border px-4 py-3.5 shadow-lg backdrop-blur-sm transition-opacity duration-300 ${styles}`}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={`mt-0.5 shrink-0 ${tone === 'success' ? 'text-emerald-700' : tone === 'error' ? 'text-red-600' : 'text-brand'}`}
          size={22}
          strokeWidth={2}
          aria-hidden
        />
        <p className="flex-1 text-sm font-semibold leading-snug pt-0.5">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-1.5 text-current/55 hover:text-current hover:bg-black/5 transition-colors"
          aria-label="Dismiss"
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
