'use client';

import React from 'react';
import Image from 'next/image';

interface AuthCardProps {
  /** When set, shows logo + brand line instead of title/subtitle. */
  brandLogoSrc?: string;
  brandName?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AuthCard({
  brandLogoSrc,
  brandName = 'HAMMERTRUST',
  title,
  subtitle,
  children,
}: AuthCardProps) {
  const showLegacyHeader = !brandLogoSrc && (title || subtitle);

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-border-soft shadow-sm p-8">
        {brandLogoSrc ? (
          <div className="flex flex-col items-center mb-8">
            <Image
              src={brandLogoSrc}
              alt={brandName}
              width={200}
              height={200}
              className="h-[200px] w-[200px] max-w-full object-contain"
              priority
            />
            <p className="mt-2 text-brand text-xl font-bold tracking-[0.2em]">
              {brandName}
            </p>
          </div>
        ) : null}
        {showLegacyHeader && title ? (
          <h1 className="text-foreground text-2xl font-bold text-center mb-2">
            {title}
          </h1>
        ) : null}
        {showLegacyHeader && subtitle ? (
          <p className="text-brand font-semibold text-center mb-6">
            {subtitle}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}

