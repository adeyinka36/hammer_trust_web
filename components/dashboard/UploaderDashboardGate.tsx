'use client';

import React, { type ReactNode } from 'react';
import RequireUploaderAuth from '@/components/auth/RequireUploaderAuth';
import UploaderDashboardShell from '@/components/dashboard/UploaderDashboardShell';

interface UploaderDashboardGateProps {
  readonly children: ReactNode;
}

export function UploaderDashboardGate({ children }: UploaderDashboardGateProps) {
  return (
    <RequireUploaderAuth>
      <UploaderDashboardShell>{children}</UploaderDashboardShell>
    </RequireUploaderAuth>
  );
}
