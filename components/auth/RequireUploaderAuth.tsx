'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUploaderAuth } from '@/context/UploaderAuthContext';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function RequireUploaderAuth({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, uploader, isLoading } = useUploaderAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
      router.replace('/login');
      return;
    }
    if (uploader && !uploader.email_verified_at) {
      router.replace('/');
    }
  }, [isLoading, token, uploader, router]);

  if (isLoading || !token || !uploader) {
    return <LoadingOverlay isVisible message="Loading…" />;
  }

  if (!uploader.email_verified_at) {
    return <LoadingOverlay isVisible message="Loading…" />;
  }

  return <>{children}</>;
}

