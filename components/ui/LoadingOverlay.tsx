'use client';

import React from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export default function LoadingOverlay({
  isVisible,
  message = 'Loading…',
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/10 backdrop-blur-[2px] flex items-center justify-center">
      <style>{`@keyframes hammertrust-spin { to { transform: rotate(360deg); } }`}</style>
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-7 w-7 rounded-full border-[3px] border-foreground/15 border-t-brand"
          style={{ animation: 'hammertrust-spin 0.9s linear infinite' }}
        />
        <p className="text-sm font-medium text-foreground/80">{message}</p>
      </div>
    </div>
  );
}
