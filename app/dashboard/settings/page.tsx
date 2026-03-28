'use client';

import React, { useCallback, useState } from 'react';
import { Building2, Hash, Mail, MapPin, Phone, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUploaderAuth } from '@/context/UploaderAuthContext';

export default function UploaderSettingsPage() {
  const router = useRouter();
  const { uploader, logout } = useUploaderAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setSigningOut(true);
    try {
      await logout();
      router.replace('/login');
    } finally {
      setSigningOut(false);
    }
  }, [logout, router]);

  const rows = [
    { icon: Building2, label: 'Business name', value: uploader?.name },
    { icon: Mail, label: 'Email', value: uploader?.email },
    { icon: Phone, label: 'Phone', value: uploader?.phone },
    { icon: Hash, label: 'CRN', value: uploader?.crn },
    { icon: MapPin, label: 'Address', value: uploader?.address },
  ] as const;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Settings
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
          Your uploader profile and session.
        </p>
      </header>

      <div className="rounded-2xl border border-border-soft bg-white shadow-sm overflow-hidden transition-shadow duration-300">
        <div className="px-6 py-4 border-b border-border-soft bg-surface-tint/60">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
            Business details
          </h2>
        </div>
        <ul className="divide-y divide-border-soft">
          {rows.map(({ icon: Icon, label, value }) => (
            <li
              key={label}
              className="flex gap-4 px-6 py-4 sm:py-5 transition-colors duration-150 hover:bg-surface-tint/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon size={18} strokeWidth={2.25} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {label}
                </p>
                <p className="mt-1 text-sm sm:text-base text-foreground font-medium break-words">
                  {value && String(value).trim() !== '' ? value : '—'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border-soft bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
          Session
        </h2>
        <button
          type="button"
          onClick={() => void handleLogout()}
          disabled={signingOut}
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border-soft bg-background px-6 py-3.5 text-sm font-bold text-foreground transition-all duration-200 hover:border-brand hover:text-brand hover:bg-surface-tint disabled:opacity-50"
        >
          <LogOut size={18} />
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </div>
  );
}
