'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import UploaderSidebar from '@/components/dashboard/UploaderSidebar';

export default function UploaderMobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open ? (
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border-soft shadow-sm transition-shadow duration-200">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="relative h-[8.25rem] w-[min(18rem,calc(100vw-5.5rem))] shrink-0">
              <Image
                src="/app-logo.png"
                alt="Hammer Trust"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-brand hover:bg-surface-tint transition-colors duration-200"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>
      ) : null}

      {open ? (
        <>
          <button
            type="button"
            className="lg:hidden fixed inset-0 bg-navy-darkest/40 z-40 backdrop-blur-[2px] transition-opacity duration-200"
            onClick={() => setOpen(false)}
            aria-label="Close overlay"
          />
          <div className="lg:hidden fixed top-0 left-0 bottom-0 w-64 z-50 overflow-y-auto shadow-2xl transition-transform duration-200 ease-out">
            <UploaderSidebar onClose={() => setOpen(false)} showCloseButton />
          </div>
        </>
      ) : null}
    </>
  );
}
