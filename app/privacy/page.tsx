'use client';

import React from 'react';
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
} from 'lucide-react';

export default function PrivacyPage() {
  const router = useRouter();

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
    </div>
  );
}
