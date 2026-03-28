'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCard from '@/components/auth/AuthCard';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import ProgressBar from '@/components/registration/ProgressBar';
import RegistrationScreen1 from '@/components/registration/RegistrationScreen1';
import RegistrationScreen2 from '@/components/registration/RegistrationScreen2';
import RegistrationScreen3 from '@/components/registration/RegistrationScreen3';
import { useUploaderAuth } from '@/context/UploaderAuthContext';
import {
  UploaderRegistrationProvider,
  useUploaderRegistration,
} from '@/context/UploaderRegistrationContext';
import type { RegistrationStep3 } from '@/lib/validation/uploader';
import { getErrorMessage } from '@/lib/api/errors';
import { registrationStep3Schema } from '@/lib/validation/uploader';
import type { RegisterPayloadValidated } from '@/lib/validation/uploader';

function RegisterContent() {
  const router = useRouter();
  const { register, isLoading, token, uploader } = useUploaderAuth();
  const { draft } = useUploaderRegistration();

  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [finishingRegistration, setFinishingRegistration] = useState(false);

  const currentStep = draft.step;

  useEffect(() => {
    if (finishingRegistration) return;
    if (!isLoading && token && uploader) {
      if (uploader.email_verified_at) router.replace('/dashboard');
      else router.replace('/?registered=1');
    }
  }, [isLoading, token, uploader, router, finishingRegistration]);

  const submitFinal = async (step3: RegistrationStep3) => {
    setFormError(null);
    setSubmitting(true);
    try {
      // Extra safety: ensure the full payload matches backend expectations.
      const payload = {
        name: draft.step1.name ?? '',
        email: draft.step1.email ?? '',
        phone: draft.step1.phone ?? '',
        crn: draft.step2.crn ?? '',
        address: draft.step2.address ?? '',
        password: step3.password,
        password_confirmation: step3.password_confirmation,
      };

      const validated = registrationStep3Schema.safeParse(step3);
      if (!validated.success) {
        throw new Error(validated.error.issues[0]?.message ?? 'Invalid data.');
      }

      setFinishingRegistration(true);
      await register(payload as unknown as RegisterPayloadValidated);
      router.replace('/?registered=1');
    } catch (err: unknown) {
      setFinishingRegistration(false);
      setFormError(getErrorMessage(err, 'Could not create your account.'));
    } finally {
      setSubmitting(false);
    }
  };

  const showOverlay = isLoading || submitting;

  return (
    <div className="min-h-screen bg-navy-darkest px-4 py-10 flex items-center justify-center">
      <AuthCard brandLogoSrc="/app-logo.png">
        <ProgressBar currentStep={currentStep} />

        {formError ? (
          <p className="text-sm text-red-600 text-center font-semibold mb-4">
            {formError}
          </p>
        ) : null}

        {currentStep === 1 ? <RegistrationScreen1 /> : null}
        {currentStep === 2 ? <RegistrationScreen2 /> : null}
        {currentStep === 3 ? (
          <RegistrationScreen3 onSubmitFinal={submitFinal} isSubmitting={submitting} />
        ) : null}

        <div className="mt-8 text-center text-sm space-y-3">
          <div className="block w-full">
            <span className="text-slate-600 font-medium">Already have an account? </span>
            <button
              type="button"
              onClick={() => router.push('/login')}
              disabled={submitting || isLoading}
              className="font-semibold text-brand hover:text-brand-hover disabled:opacity-50 inline p-0 align-baseline bg-transparent border-0 cursor-pointer underline-offset-2 hover:underline"
            >
              Log in
            </button>
          </div>
          <Link
            href="/privacy"
            className="text-slate-500 hover:text-brand text-xs font-medium underline underline-offset-2 inline-block"
          >
            Privacy & policy
          </Link>
        </div>
      </AuthCard>
      <LoadingOverlay isVisible={showOverlay} message={submitting ? 'Creating account…' : 'Loading…'} />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <UploaderRegistrationProvider>
      <RegisterContent />
    </UploaderRegistrationProvider>
  );
}

