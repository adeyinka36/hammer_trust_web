'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthInput from '@/components/auth/AuthInput';
import {
  registrationStep3Schema,
  type RegistrationStep3,
} from '@/lib/validation/uploader';
import { useUploaderRegistration } from '@/context/UploaderRegistrationContext';

export default function RegistrationScreen3({
  onSubmitFinal,
  isSubmitting,
}: {
  readonly onSubmitFinal: (step3: RegistrationStep3) => Promise<void>;
  readonly isSubmitting: boolean;
}) {
  const { setStep3, prevStep } = useUploaderRegistration();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationStep3>({
    resolver: zodResolver(registrationStep3Schema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: RegistrationStep3) => {
    setStep3(data);
    await onSubmitFinal(data);
  };

  if (!isMounted) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <AuthInput
        label="Password"
        placeholder="Create a strong password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <AuthInput
        label="Confirm password"
        placeholder="Re-enter your password"
        type="password"
        autoComplete="new-password"
        error={errors.password_confirmation?.message}
        {...register('password_confirmation')}
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 py-3 rounded-xl font-bold text-foreground bg-background border border-border-soft hover:bg-surface-tint"
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl font-bold text-white bg-brand hover:bg-brand-hover disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating…' : 'Create account'}
        </button>
      </div>
    </form>
  );
}

