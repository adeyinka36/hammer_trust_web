'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthInput from '@/components/auth/AuthInput';
import { registrationStep1Schema, type RegistrationStep1 } from '@/lib/validation/uploader';
import { useUploaderRegistration } from '@/context/UploaderRegistrationContext';

export default function RegistrationScreen1() {
  const { draft, setStep1, nextStep } = useUploaderRegistration();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationStep1>({
    resolver: zodResolver(registrationStep1Schema),
    defaultValues: {
      name: draft.step1.name ?? '',
      email: draft.step1.email ?? '',
      phone: draft.step1.phone ?? '',
    },
    mode: 'onTouched',
  });

  const onSubmit = (data: RegistrationStep1) => {
    setStep1(data);
    nextStep();
  };

  if (!isMounted) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <AuthInput
        label="Business name"
        placeholder="e.g. The Golden Fork"
        type="text"
        autoComplete="organization"
        error={errors.name?.message}
        {...register('name')}
      />

      <AuthInput
        label="Business email"
        placeholder="hello@yourbusiness.com"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <AuthInput
        label="Phone number"
        placeholder="+44 1234 567890"
        type="tel"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <button
        type="submit"
        className="w-full py-3 rounded-xl font-bold text-white bg-brand hover:bg-brand-hover disabled:opacity-50"
      >
        Continue
      </button>
    </form>
  );
}

