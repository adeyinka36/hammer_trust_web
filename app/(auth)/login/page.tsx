'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthCard from '@/components/auth/AuthCard';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { useUploaderAuth } from '@/context/UploaderAuthContext';
import { uploaderLoginSchema, type UploaderLoginForm } from '@/lib/validation/uploader';
import { getErrorMessage } from '@/lib/api/errors';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, token, uploader } = useUploaderAuth();

  const [formError, setFormError] = useState<string | null>(null);
  const [localSubmitting, setLocalSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading || !token || !uploader) return;
    if (uploader.email_verified_at) router.replace('/dashboard');
    else router.replace('/?registered=1');
  }, [isLoading, token, uploader, router]);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<UploaderLoginForm>({
    resolver: zodResolver(uploaderLoginSchema),
  });

  const onSubmit = async (data: UploaderLoginForm) => {
    setFormError(null);
    setLocalSubmitting(true);
    try {
      const signedIn = await login(data.email, data.password);
      if (signedIn.email_verified_at) {
        router.replace('/dashboard');
      } else {
        router.replace('/?registered=1');
      }
    } catch (err: unknown) {
      setFormError(getErrorMessage(err, 'Unable to log you in.'));
    } finally {
      setLocalSubmitting(false);
    }
  };

  const showOverlay = localSubmitting || isLoading;

  return (
    <div className="min-h-screen bg-background px-4 py-10 flex items-center justify-center">
      <AuthCard brandLogoSrc="/app-logo.png">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AuthInput
            label="Email"
            placeholder="you@business.com"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...registerField('email')}
          />

          <AuthInput
            label="Password"
            placeholder="Your password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...registerField('password')}
          />

          {formError ? (
            <p className="text-sm text-red-600 text-center font-semibold">
              {formError}
            </p>
          ) : null}

          <AuthButton
            title={localSubmitting ? 'Signing in…' : 'SIGN IN'}
            type="submit"
            disabled={false}
            isLoading={localSubmitting || isLoading}
          />

          <div className="text-center text-sm space-y-3">
            <div className="block w-full">
              <span className="text-slate-600 font-medium">Don&apos;t have an account? </span>
              <button
                type="button"
                onClick={() => router.push('/register')}
                disabled={localSubmitting || isLoading}
                className="font-semibold text-brand hover:text-brand-hover disabled:opacity-50 inline p-0 align-baseline bg-transparent border-0 cursor-pointer underline-offset-2 hover:underline"
              >
                Register
              </button>
            </div>
            <Link
              href="/privacy"
              className="text-slate-500 hover:text-brand text-xs font-medium underline underline-offset-2 inline-block"
            >
              Privacy & policy
            </Link>
          </div>
        </form>
      </AuthCard>

      <LoadingOverlay isVisible={showOverlay} message="Signing you in…" />
    </div>
  );
}

