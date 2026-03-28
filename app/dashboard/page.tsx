'use client';

import React from 'react';
import UploaderUserSearch from '@/components/dashboard/UploaderUserSearch';
import { useUploaderAuth } from '@/context/UploaderAuthContext';

export default function DashboardPage() {
  const { uploader } = useUploaderAuth();

  return (
    <div className="space-y-8">
      <header>
        <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
          Signed in as{' '}
          <span className="font-semibold text-foreground">{uploader?.name ?? '—'}</span>
          {uploader?.email ? (
            <>
              {' '}
              · <span className="text-foreground/80">{uploader.email}</span>
            </>
          ) : null}
        </p>
      </header>

      <UploaderUserSearch />
    </div>
  );
}
