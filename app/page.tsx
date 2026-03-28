'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PendingEmailVerificationPanel from '@/components/uploader/PendingEmailVerificationPanel';
import { useUploaderAuth } from '@/context/UploaderAuthContext';

function isEmailVerified(emailVerifiedAt: string | null | undefined): boolean {
  return Boolean(emailVerifiedAt);
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, uploader, isLoading } = useUploaderAuth();
  const welcomeFromRegistration = searchParams.get('registered') === '1';

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
      router.replace('/login');
      return;
    }
    if (uploader && isEmailVerified(uploader.email_verified_at)) {
      router.replace('/dashboard');
    }
  }, [isLoading, token, uploader, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-pulse text-sm font-medium text-slate-500">Loading…</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-pulse text-sm font-medium text-slate-500">Loading…</div>
      </div>
    );
  }

  if (uploader && isEmailVerified(uploader.email_verified_at)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-pulse text-sm font-medium text-slate-500">Loading…</div>
      </div>
    );
  }

  if (!uploader) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-pulse text-sm font-medium text-slate-500">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6 py-10">
      <PendingEmailVerificationPanel welcomeSubtitle={welcomeFromRegistration} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="animate-pulse text-sm font-medium text-slate-500">Loading…</div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
