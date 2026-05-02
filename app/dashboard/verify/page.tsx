'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUploaderAuth } from '@/context/UploaderAuthContext';
import { verifyFaceByCode } from '@/lib/api/face-verify';
import { getErrorMessage } from '@/lib/api/errors';

const CODE_LENGTH = 6;

export default function VerifyPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const codeInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startCameraRequestRef = useRef(0);
  const previewUrlRef = useRef<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [startingCamera, setStartingCamera] = useState(false);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [navigatingToDashboard, setNavigatingToDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiClient } = useUploaderAuth();

  const canSubmit = useMemo(
    () => capturedFile !== null && code.trim().length === CODE_LENGTH && !submitting,
    [capturedFile, code, submitting]
  );

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    const requestId = startCameraRequestRef.current + 1;
    startCameraRequestRef.current = requestId;
    setStartingCamera(true);
    setError(null);
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      if (startCameraRequestRef.current !== requestId) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr: unknown) {
          const message = playErr instanceof Error ? playErr.message : String(playErr);
          if (!message.includes('interrupted by a new load request')) {
            throw playErr;
          }
        }
      }
      setCameraReady(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Unable to access camera.'));
    } finally {
      if (startCameraRequestRef.current === requestId) {
        setStartingCamera(false);
      }
    }
  }, [stopCamera]);

  const capture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((fileBlob) => resolve(fileBlob), 'image/jpeg', 0.92);
    });
    if (!blob) {
      setError('Could not capture image. Please try again.');
      return;
    }
    const file = new File([blob], `verify-${Date.now()}.jpg`, { type: 'image/jpeg' });
    setCapturedFile(file);
    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      previewUrlRef.current = nextUrl;
      return nextUrl;
    });
    stopCamera();
  }, [stopCamera]);

  const resetCapture = useCallback(() => {
    setCapturedFile(null);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrlRef.current = null;
      setPreviewUrl(null);
    }
    void startCamera();
  }, [previewUrl, startCamera]);

  const clearAll = useCallback(() => {
    stopCamera();
    setCode('');
    setError(null);
    setCapturedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrlRef.current = null;
      setPreviewUrl(null);
    }
    void startCamera();
  }, [previewUrl, startCamera, stopCamera]);

  const submit = useCallback(async () => {
    if (!capturedFile) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await verifyFaceByCode(apiClient, { secret: code, image: capturedFile });
      if (!result.success || !result.user) {
        setError(result.message || 'No face match found for this code.');
        return;
      }
      setNavigatingToDashboard(true);
      router.replace(`/dashboard?matchedEmail=${encodeURIComponent(result.user.email)}`);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Verification failed.'));
    } finally {
      setSubmitting(false);
    }
  }, [apiClient, capturedFile, code, router]);

  useEffect(() => {
    void startCamera();
    return () => {
      stopCamera();
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, [startCamera, stopCamera]);

  const codeDigits = Array.from({ length: CODE_LENGTH }, (_, index) => code[index] ?? '');

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <header className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Verify</h1>
          <p className="text-sm text-slate-600">
            Capture face, enter 6-digit code, and reveal the matched account email.
          </p>
        </header>

        <div className="rounded-2xl border border-border-soft bg-white p-4 sm:p-6 space-y-4">
        <div className="rounded-xl border border-border-soft bg-slate-50 overflow-hidden aspect-video flex items-center justify-center">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Captured face" className="w-full h-full object-cover" />
          ) : (
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {!capturedFile ? (
            <button
              type="button"
              onClick={() => void capture()}
              disabled={!cameraReady || startingCamera}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-white font-semibold disabled:opacity-60"
            >
              <Camera size={18} />
              {startingCamera ? 'Starting camera…' : 'Capture'}
            </button>
          ) : (
            <button
              type="button"
              onClick={resetCapture}
              className="rounded-xl border border-border-soft px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-brand"
            >
              Retake photo
            </button>
          )}
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">6-digit code</span>
          <input
            ref={codeInputRef}
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH))}
            inputMode="numeric"
            maxLength={CODE_LENGTH}
            placeholder="000000"
            className="sr-only"
          />
          <button
            type="button"
            onClick={() => codeInputRef.current?.focus()}
            className="mt-2 w-full"
          >
            <span className="sr-only">Focus 6 digit code input</span>
            <span className="flex justify-between gap-2 sm:gap-3">
              {codeDigits.map((digit, index) => (
                <span
                  key={index}
                  className="flex-1 min-h-14 sm:min-h-16 rounded-2xl border-2 border-primary-200 bg-primary-50 text-navy-darkest text-2xl sm:text-3xl font-bold flex items-center justify-center tabular-nums"
                >
                  {digit || '·'}
                </span>
              ))}
            </span>
          </button>
        </label>

        <label className="block">
          <span className="sr-only">6-digit code fallback input</span>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH))}
            inputMode="numeric"
            maxLength={CODE_LENGTH}
            placeholder="000000"
            className="mt-2 w-full rounded-xl border border-border-soft px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand/30 sm:hidden"
          />
        </label>

        <button
          type="button"
          onClick={() => void submit()}
          disabled={!canSubmit}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-8 py-4 text-base sm:text-lg text-white font-bold shadow-md hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:hover:bg-brand"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Verifying identity…
            </>
          ) : (
            'Verify'
          )}
        </button>
        <button
          type="button"
          onClick={clearAll}
          disabled={submitting}
          className="w-full inline-flex items-center justify-center rounded-2xl border border-border-soft bg-white px-6 py-3 text-sm sm:text-base font-semibold text-slate-700 hover:text-brand hover:border-brand/40 transition-colors disabled:opacity-60"
        >
          Clear all
        </button>

        {error ? <p className="text-sm text-red-600 font-medium">{error}</p> : null}
        {submitting ? (
          <div className="rounded-xl border border-brand/20 bg-brand/5 px-4 py-3">
            <p className="text-sm text-brand font-medium">
              Matching face and code securely. This usually takes a few seconds.
            </p>
          </div>
        ) : null}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {navigatingToDashboard ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/85 backdrop-blur-sm px-4"
          aria-busy
          aria-live="polite"
        >
          <div className="w-full max-w-sm rounded-2xl border border-border-soft bg-white px-8 py-10 shadow-xl text-center space-y-5">
            <Loader2 className="mx-auto animate-spin text-brand" size={40} strokeWidth={2} />
            <div className="space-y-1">
              <p className="text-base font-bold text-foreground">Taking you to the dashboard</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Opening the matched user workspace…
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
