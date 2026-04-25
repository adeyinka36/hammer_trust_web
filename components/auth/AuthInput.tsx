'use client';

import React from 'react';

interface AuthInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
}

export default function AuthInput({
  label,
  error,
  className,
  ...props
}: AuthInputProps) {
  return (
    <div className="space-y-2">
      {label ? (
        <label className="block text-sm font-semibold text-foreground">
          {label}
        </label>
      ) : null}
      <input
        {...props}
        className={[
          'w-full px-4 py-3 rounded-xl border outline-none transition-colors',
          'bg-surface-tint border-border-soft text-navy-darkest caret-brand',
          'placeholder:text-[#7B8AA8]',
          'focus:ring-2 focus:ring-brand/25 focus:border-brand',
          error ? 'border-red-400 focus:ring-red-400/20' : '',
          className ?? '',
        ].join(' ')}
      />
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}

