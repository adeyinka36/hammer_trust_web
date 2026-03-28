'use client';

import React from 'react';

export default function ProgressBar({ currentStep }: { currentStep: number }) {
  const steps = [1, 2, 3];
  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-2">
        {steps.map((s) => {
          const isActive = s === currentStep;
          const isDone = s < currentStep;
          return (
            <div key={s} className="flex-1">
              <div
                className={[
                  'h-2 rounded-full',
                  isDone ? 'bg-brand' : isActive ? 'bg-brand' : 'bg-border-soft',
                ].join(' ')}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex justify-between text-xs font-semibold text-foreground/70">
        <span>Account</span>
        <span>Details</span>
        <span>Security</span>
      </div>
    </div>
  );
}

