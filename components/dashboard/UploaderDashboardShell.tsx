'use client';

import React, { type ReactNode } from 'react';
import UploaderMobileHeader from '@/components/dashboard/UploaderMobileHeader';
import UploaderSidebar from '@/components/dashboard/UploaderSidebar';

interface UploaderDashboardShellProps {
  readonly children: ReactNode;
}

export default function UploaderDashboardShell({ children }: UploaderDashboardShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <UploaderMobileHeader />
      <div className="hidden lg:flex w-64 shrink-0 fixed left-0 top-0 h-screen z-30">
        <UploaderSidebar />
      </div>
      <main className="flex-1 min-w-0 lg:ml-64 pt-[10.25rem] lg:pt-0 transition-[padding] duration-200">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
