'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { RegistrationStep1, RegistrationStep2, RegistrationStep3 } from '@/lib/validation/uploader';

export interface UploaderRegistrationDraft {
  step: 1 | 2 | 3;
  step1: Partial<RegistrationStep1>;
  step2: Partial<RegistrationStep2>;
  step3: Partial<RegistrationStep3>;
}

const emptyDraft = (): UploaderRegistrationDraft => ({
  step: 1,
  step1: {},
  step2: {},
  step3: {},
});

interface UploaderRegistrationContextValue {
  draft: UploaderRegistrationDraft;
  setStep1: (data: RegistrationStep1) => void;
  setStep2: (data: RegistrationStep2) => void;
  setStep3: (data: RegistrationStep3) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const UploaderRegistrationContext = createContext<UploaderRegistrationContextValue | undefined>(
  undefined
);

export function useUploaderRegistration(): UploaderRegistrationContextValue {
  const ctx = useContext(UploaderRegistrationContext);
  if (!ctx) {
    throw new Error('useUploaderRegistration must be used within UploaderRegistrationProvider');
  }
  return ctx;
}

export function UploaderRegistrationProvider({ children }: { readonly children: ReactNode }) {
  const [draft, setDraft] = useState<UploaderRegistrationDraft>(emptyDraft);

  const setStep1 = useCallback((data: RegistrationStep1) => {
    setDraft((prev) => ({ ...prev, step1: data }));
  }, []);

  const setStep2 = useCallback((data: RegistrationStep2) => {
    setDraft((prev) => ({ ...prev, step2: data }));
  }, []);

  const setStep3 = useCallback((data: RegistrationStep3) => {
    setDraft((prev) => ({ ...prev, step3: data }));
  }, []);

  const nextStep = useCallback(() => {
    setDraft((prev) => ({
      ...prev,
      step: prev.step === 1 ? 2 : 3,
    }));
  }, []);

  const prevStep = useCallback(() => {
    setDraft((prev) => ({
      ...prev,
      step: prev.step === 3 ? 2 : 1,
    }));
  }, []);

  const reset = useCallback(() => {
    setDraft(emptyDraft());
  }, []);

  const value = useMemo(
    () => ({
      draft,
      setStep1,
      setStep2,
      setStep3,
      nextStep,
      prevStep,
      reset,
    }),
    [draft, setStep1, setStep2, setStep3, nextStep, prevStep, reset]
  );

  return (
    <UploaderRegistrationContext.Provider value={value}>
      {children}
    </UploaderRegistrationContext.Provider>
  );
}
