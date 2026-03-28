'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthInput from '@/components/auth/AuthInput';
import {
  registrationStep2Schema,
  type RegistrationStep2,
} from '@/lib/validation/uploader';
import { useUploaderRegistration } from '@/context/UploaderRegistrationContext';

export default function RegistrationScreen2() {
  const { draft, setStep2, nextStep, prevStep } = useUploaderRegistration();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationStep2>({
    resolver: zodResolver(registrationStep2Schema),
    defaultValues: {
      crn: draft.step2.crn ?? '',
      address: draft.step2.address ?? '',
    },
    mode: 'onTouched',
  });

  const crnValue = watch('crn') ?? '';

  useEffect(() => {
    const digits = crnValue.replace(/\D/g, '').slice(0, 8);
    if (digits !== crnValue) {
      setValue('crn', digits, { shouldValidate: true, shouldDirty: true });
    }
  }, [crnValue, setValue]);

  const onSubmit = (data: RegistrationStep2) => {
    setStep2(data);
    nextStep();
  };

  if (!isMounted) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <AuthInput
          label="CRN (8 digits)"
          placeholder="e.g. 12345678"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={8}
          error={errors.crn?.message}
          {...register('crn')}
        />
        <p className="text-xs text-slate-600">
          Enter your 8-digit Companies House company number (digits only).
        </p>
      </div>

      <AuthInput
        label="Address"
        placeholder="Business address"
        type="text"
        autoComplete="street-address"
        error={errors.address?.message}
        {...register('address')}
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 py-3 rounded-xl font-bold text-foreground bg-background border border-border-soft hover:bg-surface-tint"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl font-bold text-white bg-brand hover:bg-brand-hover disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
