'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthInput from '@/components/auth/AuthInput';
import {
  changeUploaderEmailSchema,
  type ChangeUploaderEmailForm,
} from '@/lib/validation/uploader';
import { useUploaderAuth } from '@/context/UploaderAuthContext';
import { getErrorMessage } from '@/lib/api/errors';

interface PendingEmailVerificationPanelProps {
  readonly welcomeSubtitle?: boolean;
}

export default function PendingEmailVerificationPanel({
  welcomeSubtitle = false,
}: PendingEmailVerificationPanelProps) {
  const { uploader, changeUploaderEmail, refreshUploader, logout } = useUploaderAuth();
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingVerified, setCheckingVerified] = useState(false);

  const email = uploader?.email ?? '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeUploaderEmailForm>({
    resolver: zodResolver(changeUploaderEmailSchema),
    defaultValues: { email: '', email_confirmation: '' },
  });

  const onChangeEmail = async (data: ChangeUploaderEmailForm) => {
    setFormError(null);
    setSuccessMessage(null);
    setSubmitting(true);
    try {
      await changeUploaderEmail({
        email: data.email,
        email_confirmation: data.email_confirmation,
      });
      setSuccessMessage(
        `We sent a new verification link to ${data.email.trim()}. Check that inbox (and spam).`
      );
      reset({ email: '', email_confirmation: '' });
      setShowChangeEmail(false);
    } catch (err: unknown) {
      setFormError(getErrorMessage(err, 'Could not update your email.'));
    } finally {
      setSubmitting(false);
    }
  };

  const onCheckVerified = async () => {
    setFormError(null);
    setCheckingVerified(true);
    try {
      await refreshUploader();
      setSuccessMessage(null);
    } catch {
      setFormError('Could not refresh your account. Try again.');
    } finally {
      setCheckingVerified(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl border border-border-soft shadow-sm p-8 text-center">
      <h1 className="text-xl font-bold text-foreground mb-2">Check your email</h1>
      {welcomeSubtitle ? (
        <p className="text-sm text-slate-600 mb-4">You&apos;re almost set. One more step.</p>
      ) : null}

      <p className="text-sm text-slate-600 leading-relaxed mb-2">
        We&apos;ve sent a verification link to:
      </p>
      <p className="text-base font-semibold text-foreground break-all mb-6">{email}</p>

      <p className="text-sm text-slate-600 leading-relaxed mb-6">
        Open the link in that inbox to confirm your uploader account. You can close this page and
        come back after verifying.
      </p>

      {successMessage ? (
        <p className="text-sm text-emerald-700 font-medium mb-4 text-left rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          {successMessage}
        </p>
      ) : null}

      {formError ? (
        <p className="text-sm text-red-600 font-semibold mb-4">{formError}</p>
      ) : null}

      {!showChangeEmail ? (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              setShowChangeEmail(true);
              setFormError(null);
              setSuccessMessage(null);
              reset({ email: '', email_confirmation: '' });
            }}
            className="w-full rounded-xl py-3 font-semibold text-brand border border-border-soft bg-surface-tint hover:bg-background transition-colors"
          >
            Wrong email? Use a different address
          </button>
          <button
            type="button"
            onClick={() => void onCheckVerified()}
            disabled={checkingVerified}
            className="w-full rounded-xl py-3 font-bold text-white bg-brand hover:bg-brand-hover disabled:opacity-50 transition-colors"
          >
            {checkingVerified ? 'Checking…' : "I've verified. Continue"}
          </button>
          <button
            type="button"
            onClick={() => void logout().then(() => window.location.assign('/login'))}
            className="w-full text-sm text-slate-600 hover:text-brand font-medium underline-offset-2 hover:underline"
          >
            Sign out
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onChangeEmail)} className="space-y-4 text-left">
          <p className="text-sm text-slate-600">
            Enter the address twice. We&apos;ll send the verification link there and update your
            account.
          </p>
          <AuthInput
            label="New email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <AuthInput
            label="Confirm new email"
            type="email"
            autoComplete="email"
            error={errors.email_confirmation?.message}
            {...register('email_confirmation')}
          />
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl py-3 font-bold text-white bg-brand hover:bg-brand-hover disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Confirm and send verification'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowChangeEmail(false);
                setFormError(null);
                reset({ email: '', email_confirmation: '' });
              }}
              className="w-full py-2 text-sm font-medium text-slate-600 hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <p className="mt-8 text-xs text-slate-500">
        <Link href="/privacy" className="text-brand hover:text-brand-hover font-medium underline">
          Privacy & policy
        </Link>
      </p>
    </div>
  );
}
