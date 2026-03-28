import { z } from 'zod';

/** 8-digit company number (digits only); matches backend `CrnVerificationService`. */
const crnSchema = z
  .string()
  .trim()
  .transform((s) => s.replace(/\D/g, ''))
  .refine((s) => /^\d{8}$/.test(s), 'CRN must be exactly 8 digits.');

/** Conservative match to Laravel `Password::defaults()` (min length + complexity). */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[a-zA-Z]/, 'Password must include at least one letter.')
  .regex(/[0-9]/, 'Password must include at least one number.');

export const uploaderLoginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export type UploaderLoginForm = z.infer<typeof uploaderLoginSchema>;

export const registrationStep1Schema = z.object({
  name: z.string().trim().min(1, 'Business name is required.').max(255),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().min(1, 'Phone number is required.').max(255),
});

export type RegistrationStep1 = z.infer<typeof registrationStep1Schema>;

export const registrationStep2Schema = z.object({
  crn: crnSchema,
  address: z.string().trim().min(1, 'Address is required.').max(1000),
});

export type RegistrationStep2 = z.infer<typeof registrationStep2Schema>;

export const registrationStep3Schema = z
  .object({
    password: passwordSchema,
    password_confirmation: z.string().min(1, 'Confirm your password.'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match.',
    path: ['password_confirmation'],
  });

export type RegistrationStep3 = z.infer<typeof registrationStep3Schema>;

/** Full uploader registration body (matches `POST /uploaders/register`). */
export const registerPayloadSchema = registrationStep1Schema
  .merge(registrationStep2Schema)
  .merge(registrationStep3Schema);

export type RegisterPayloadValidated = z.infer<typeof registerPayloadSchema>;

export const changeUploaderEmailSchema = z
  .object({
    email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
    email_confirmation: z
      .string()
      .trim()
      .min(1, 'Confirm your email address.'),
  })
  .refine((data) => data.email === data.email_confirmation, {
    message: 'Email addresses do not match.',
    path: ['email_confirmation'],
  });

export type ChangeUploaderEmailForm = z.infer<typeof changeUploaderEmailSchema>;
