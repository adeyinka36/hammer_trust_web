'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Shield,
  Building2,
  FileUp,
  Smartphone,
  Lock,
  Cookie,
  Mail,
  Trash2,
  AlertTriangle,
  Loader2,
  X,
} from 'lucide-react';
import { createApiClient } from '@/lib/api/client';
import { deleteAccountByCredentials } from '@/lib/api/privacy';
import { getErrorMessage, getFieldErrors } from '@/lib/api/errors';

export default function PrivacyPage() {
  const router = useRouter();
  const apiClient = useMemo(() => createApiClient(() => null), []);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetDeleteForm = () => {
    setEmail('');
    setPassword('');
    setConfirmationText('');
    setFieldErrors({});
    setSubmitMessage(null);
    setSubmitError(null);
    setIsSubmitting(false);
  };

  const closeDeleteModal = () => {
    if (isSubmitting) return;
    setDeleteModalOpen(false);
    resetDeleteForm();
  };

  const openDeleteModal = () => {
    resetDeleteForm();
    setDeleteModalOpen(true);
  };

  const handleDeleteRequest = async () => {
    setFieldErrors({});
    setSubmitMessage(null);
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const response = await deleteAccountByCredentials(apiClient, {
        email,
        password,
        confirmation_text: confirmationText,
      });
      setSubmitMessage(response.message);
    } catch (error: unknown) {
      const nextFieldErrors = getFieldErrors(error);
      if (Object.keys(nextFieldErrors).length > 0) {
        setFieldErrors(nextFieldErrors);
      } else {
        setSubmitError(getErrorMessage(error, 'Unable to process deletion request right now.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmitDelete =
    !isSubmitting &&
    email.trim().length > 0 &&
    password.length > 0 &&
    confirmationText.trim().length > 0;

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-brand hover:text-brand-hover mb-8 text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-white rounded-2xl border border-border-soft shadow-sm p-8 md:p-10">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-brand w-8 h-8 shrink-0" />
            <h1 className="text-foreground text-2xl md:text-3xl font-bold tracking-tight">
              Privacy & policy
            </h1>
          </div>
          <p className="text-sm text-slate-500 mb-8">Last updated: 28 March 2026</p>

          <div className="space-y-8 text-foreground">
            <section>
              <p className="text-sm leading-6 text-slate-700">
                Hammer Trust connects regulated businesses (&ldquo;uploaders&rdquo;) with people who
                receive documents through our platform. This notice covers the{' '}
                <strong className="font-semibold text-foreground">uploader web portal</strong> and
                summarises how the related <strong className="font-semibold text-foreground">mobile app</strong>{' '}
                uses permissions and personal data. It is a plain-language summary and does not replace
                legal agreements your organisation may have with you.
              </p>
            </section>

            <section className="rounded-xl border border-border-soft bg-surface-tint p-6">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="text-brand w-5 h-5" />
                <h2 className="text-lg font-semibold text-foreground">
                  Uploader portal. What we collect
                </h2>
              </div>
              <p className="text-sm leading-6 text-slate-700">
                When you register and use the uploader portal, we process information you provide:
                business or trading name, email, phone, company registration number (CRN) where
                applicable, business address, account credentials, and documents or metadata you
                upload so they can be delivered to the correct recipients. We use this to operate
                accounts, authenticate you, comply with reasonable security and audit needs, and
                provide the document workflow you expect.
              </p>
            </section>

            <section className="rounded-xl border border-border-soft bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileUp className="text-brand w-5 h-5" />
                <h2 className="text-lg font-semibold text-foreground">
                  Documents & recipients
                </h2>
              </div>
              <p className="text-sm leading-6 text-slate-700">
                Files you upload are stored and processed so they can be shown to the intended
                end users in the Hammer Trust app. Features such as time-limited access or access
                requests are designed so recipients stay in control of who can view their
                documents and for how long. Do not upload content you are not entitled to share or
                that violates applicable law.
              </p>
            </section>

            <section className="rounded-xl border border-red-200 bg-red-50/60 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Trash2 className="text-red-600 w-5 h-5" />
                <h2 className="text-lg font-semibold text-foreground">Delete user details</h2>
              </div>
              <p className="text-sm leading-6 text-slate-700 mb-4">
                If you want to permanently delete all details for an account, confirm ownership with email,
                password, and the confirmation phrase. This action cannot be undone.
              </p>
              <button
                type="button"
                onClick={openDeleteModal}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete user details
              </button>
            </section>

            <section className="rounded-xl border border-border-soft bg-surface-tint p-6">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="text-brand w-5 h-5" />
                <h2 className="text-lg font-semibold text-foreground">
                  Mobile app (end users)
                </h2>
              </div>
              <p className="text-sm leading-6 text-slate-700 mb-3">
                End users who install the Hammer Trust app may use camera-based face verification,
                registration photos, security codes, push notifications for access requests, and
                in-app document viewing. The in-app &ldquo;Privacy & policy&rdquo; screen summarises
                those permissions. Processing is tied to identity verification, document delivery,
                and notifications you opt into or that are essential to the service.
              </p>
            </section>

            <section className="rounded-xl border border-border-soft bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="text-brand w-5 h-5" />
                <h2 className="text-lg font-semibold text-foreground">
                  Security & retention
                </h2>
              </div>
              <p className="text-sm leading-6 text-slate-700">
                We use technical and organisational measures appropriate to the service (including
                encryption in transit and access controls). We retain data only as long as needed to
                provide the platform, meet legal obligations, and resolve disputes. Retention periods
                may differ by data type and your organisation&apos;s instructions where applicable.
              </p>
            </section>

            <section className="rounded-xl border border-border-soft bg-surface-tint p-6">
              <div className="flex items-center gap-2 mb-3">
                <Cookie className="text-brand w-5 h-5" />
                <h2 className="text-lg font-semibold text-foreground">
                  Cookies & similar technologies
                </h2>
              </div>
              <p className="text-sm leading-6 text-slate-700">
                The uploader portal may use cookies or local storage to keep you signed in and to
                protect against abuse. You can clear site data in your browser; you will need to
                sign in again afterwards.
              </p>
            </section>

            <section className="rounded-xl border border-border-soft bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="text-brand w-5 h-5" />
                <h2 className="text-lg font-semibold text-foreground">
                  Your rights & contact
                </h2>
              </div>
              <p className="text-sm leading-6 text-slate-700">
                Depending on where you live, you may have rights to access, correct, delete, or
                restrict certain processing of your personal data. To exercise these rights or to
                ask about data handling, contact the organisation operating Hammer Trust for your
                region or use the support channel they publish. For account closure or deletion
                requests, contact the same channel so we can verify your identity and coordinate
                with any business customer linked to your account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Changes</h2>
              <p className="text-sm leading-6 text-slate-700">
                We may update this page when our products or legal requirements change. The
                &ldquo;Last updated&rdquo; date at the top will be revised when we do. Continued use
                of the portal or app after material updates may constitute acceptance of those
                changes where permitted by law.
              </p>
            </section>

            <div className="pt-4 border-t border-border-soft">
              <Link
                href="/login"
                className="text-sm font-semibold text-brand hover:text-brand-hover"
              >
                ← Return to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {deleteModalOpen ? (
        <div className="fixed inset-0 z-50 bg-black/45 px-4 py-8 flex items-center justify-center">
          <div className="w-full max-w-lg rounded-2xl border border-border-soft bg-white shadow-xl">
            <div className="flex items-start justify-between gap-3 border-b border-border-soft px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl bg-red-100 p-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Delete account details</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-5">
                    Confirm credentials and type the phrase exactly:
                    <span className="font-semibold text-foreground"> delete my information</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-full p-1 text-slate-500 hover:text-slate-700"
                aria-label="Close deletion dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label htmlFor="delete-email" className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">
                  Email
                </label>
                <input
                  id="delete-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border-soft px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {fieldErrors.email ? <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p> : null}
              </div>

              <div>
                <label htmlFor="delete-password" className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">
                  Password
                </label>
                <input
                  id="delete-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border-soft px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand"
                  placeholder="Your password"
                  autoComplete="current-password"
                />
                {fieldErrors.password ? <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p> : null}
              </div>

              <div>
                <label htmlFor="delete-confirmation-text" className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">
                  Confirmation phrase
                </label>
                <input
                  id="delete-confirmation-text"
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="w-full rounded-lg border border-border-soft px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand"
                  placeholder="delete my information"
                />
                {fieldErrors.confirmation_text ? (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmation_text}</p>
                ) : null}
              </div>

              {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
              {submitMessage ? <p className="text-sm text-emerald-700">{submitMessage}</p> : null}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border-soft px-6 py-4">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isSubmitting}
                className="rounded-lg border border-border-soft px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteRequest()}
                disabled={!canSubmitDelete}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
