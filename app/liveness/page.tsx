'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { ThemeProvider } from '@aws-amplify/ui-react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import '@aws-amplify/ui-react/styles.css';

function readQuery(): { sessionId: string; region: string } {
  if (typeof window === 'undefined') {
    return { sessionId: '', region: 'us-east-1' };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    sessionId: params.get('sessionId') ?? params.get('session_id') ?? '',
    region: params.get('region') ?? process.env.NEXT_PUBLIC_AWS_REGION ?? 'us-east-1',
  };
}

/**
 * Hosted Face Liveness challenge for the mobile app (opened in an in-app browser).
 * Requires NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID with rekognition:StartFaceLivenessSession.
 */
export default function LivenessPage() {
  const [{ sessionId, region }, setQuery] = useState(() => readQuery());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const identityPoolId = process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID ?? '';

  useEffect(() => {
    setQuery(readQuery());
  }, []);

  useEffect(() => {
    if (!identityPoolId) {
      setError(
        'Face Liveness is not configured. Set NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID on the web app.',
      );
      return;
    }
    if (!sessionId) {
      setError('Missing sessionId. Start live face check from the Hammer Trust app.');
      return;
    }

    try {
      Amplify.configure({
        Auth: {
          Cognito: {
            identityPoolId,
            allowGuestAccess: true,
          },
        },
      });
      setReady(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not configure Face Liveness.');
    }
  }, [identityPoolId, sessionId]);

  const deepLink = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_APP_DEEP_LINK ?? 'hammertrustapp://face-liveness-done';
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}session_id=${encodeURIComponent(sessionId)}`;
  }, [sessionId]);

  const onComplete = useCallback(async () => {
    setDone(true);
    window.location.href = deepLink;
  }, [deepLink]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Live face check</h1>
        <p className="text-sm text-slate-600 mb-6">
          Follow the on-screen prompts. When finished, you will return to the Hammer Trust app to
          enroll your face.
        </p>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {done ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Check complete. Returning to the app…
            <div className="mt-3">
              <a className="underline font-medium" href={deepLink}>
                Tap here if you are not redirected
              </a>
            </div>
          </div>
        ) : null}

        {ready && sessionId && !done ? (
          <ThemeProvider>
            <FaceLivenessDetector
              sessionId={sessionId}
              region={region}
              onAnalysisComplete={onComplete}
              onError={(err) => {
                setError(err?.error?.message ?? 'Face Liveness failed. Close and try again in the app.');
              }}
            />
          </ThemeProvider>
        ) : null}
      </div>
    </main>
  );
}
