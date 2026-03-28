'use client';

import React from 'react';

interface AuthButtonProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  type?: 'button' | 'submit';
}

export default function AuthButton({
  title,
  onClick,
  disabled,
  isLoading,
  type = 'button',
}: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={[
        'w-full py-3 rounded-xl font-bold text-white transition-colors',
        'bg-brand hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed',
      ].join(' ')}
    >
      {isLoading ? 'Please wait…' : title}
    </button>
  );
}

