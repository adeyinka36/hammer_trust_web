'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useUploaderAuth } from '@/context/UploaderAuthContext';
import { verifyFaceByCode, type VerifyFaceMatch } from '@/lib/api/face-verify';
import { getErrorMessage } from '@/lib/api/errors';

const CODE_LENGTH = 6;

export default function VerifyPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [startingCamera, setStartingCamera] = useState(false);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [match, setMatch] = useState<VerifyFaceMatch | null>(null);
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
    setStartingCamera(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Unable to access camera.'));
    } finally {
      setStartingCamera(false);
    }
  }, []);

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
      return nextUrl;
    });
    stopCamera();
  }, [stopCamera]);

  const resetCapture = useCallback(() => {
    setCapturedFile(null);
    setMatch(null);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    void startCamera();
  }, [previewUrl, startCamera]);

  const submit = useCallback(async () => {
    if (!capturedFile) return;
    setSubmitting(true);
    setError(null);
    setMatch(null);
    try {
      const result = await verifyFaceByCode(apiClient, { secret: code, image: capturedFile });
      if (!result.success || !result.user) {
        setError(result.message || 'No face match found for this code.');
        return;
      }
      setMatch(result.user);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Verification failed.'));
    } finally {
      setSubmitting(false);
    }
  }, [apiClient, capturedFile, code]);

  useEffect(() => {
    void startCamera();
    return () => {
      stopCamera();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [startCamera, stopCamera, previewUrl]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
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
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH))}
            inputMode="numeric"
            maxLength={CODE_LENGTH}
            placeholder="000000"
            className="mt-2 w-full rounded-xl border border-border-soft px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand/30"
          />
        </label>

        <button
          type="button"
          onClick={() => void submit()}
          disabled={!canSubmit}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-white font-semibold shadow-md hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:hover:bg-brand"
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

        {error ? <p className="text-sm text-red-600 font-medium">{error}</p> : null}
        {submitting ? (
          <div className="rounded-xl border border-brand/20 bg-brand/5 px-4 py-3">
            <p className="text-sm text-brand font-medium">
              Matching face and code securely. This usually takes a few seconds.
            </p>
          </div>
        ) : null}
        {match ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-sm font-semibold text-emerald-900">Matched email: {match.email}</p>
            {match.similarity != null ? (
              <p className="text-xs text-emerald-800 mt-1">Similarity: {Math.round(match.similarity)}%</p>
            ) : null}
          </div>
        ) : null}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
