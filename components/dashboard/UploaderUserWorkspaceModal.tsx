'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { AxiosInstance } from 'axios';
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  deleteUploaderUserDocument,
  fetchUploaderUserDocuments,
  uploadUploaderUserDocument,
} from '@/lib/api/uploader-user-documents';
import { getErrorMessage } from '@/lib/api/errors';
import type { UploaderDocument } from '@/lib/types/uploader-documents';
import type { UploaderUserSearchHit } from '@/lib/types/uploader-user-search';

type Tab = 'documents' | 'uploads';

function formatBytes(n: number | null | undefined): string {
  if (n == null || n <= 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function documentStatusBadge(doc: UploaderDocument): { label: string; className: string } {
  if (doc.declined_at) {
    return { label: 'Declined', className: 'bg-red-100 text-red-800' };
  }
  if (doc.active === true) {
    return { label: 'Active', className: 'bg-emerald-100 text-emerald-800' };
  }
  return { label: 'Pending acceptance', className: 'bg-amber-100 text-amber-900' };
}

interface UploaderUserWorkspaceModalProps {
  readonly user: UploaderUserSearchHit;
  readonly onClose: () => void;
  readonly apiClient: AxiosInstance;
}

export default function UploaderUserWorkspaceModal({
  user,
  onClose,
  apiClient,
}: UploaderUserWorkspaceModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const [tab, setTab] = useState<Tab>('documents');
  const [documents, setDocuments] = useState<UploaderDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [docsError, setDocsError] = useState<string | null>(null);

  const [uploadName, setUploadName] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadOk, setUploadOk] = useState<string | null>(null);

  const [deleteDialogDoc, setDeleteDialogDoc] = useState<UploaderDocument | null>(null);
  const [deleteDialogError, setDeleteDialogError] = useState<string | null>(null);
  const [deleteSuccessDoc, setDeleteSuccessDoc] = useState<UploaderDocument | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadDocs = useCallback(async () => {
    setLoadingDocs(true);
    setDocsError(null);
    try {
      const { documents: list } = await fetchUploaderUserDocuments(apiClient, user.id);
      setDocuments(list);
    } catch (err: unknown) {
      setDocsError(getErrorMessage(err, 'Could not load documents.'));
    } finally {
      setLoadingDocs(false);
    }
  }, [apiClient, user.id]);

  useEffect(() => {
    setTab('documents');
    setDeleteDialogDoc(null);
    setDeleteDialogError(null);
    setDeleteSuccessDoc(null);
    setUploadError(null);
    setUploadOk(null);
    void loadDocs();
  }, [loadDocs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => panelRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    setUploadOk(null);
    if (!uploadName.trim()) {
      setUploadError('Enter a display name for this file.');
      return;
    }
    if (!uploadFile) {
      setUploadError('Choose a file to upload.');
      return;
    }
    setUploading(true);
    try {
      await uploadUploaderUserDocument(apiClient, user.id, {
        name: uploadName.trim(),
        description: uploadDescription,
        file: uploadFile,
      });
      setUploadOk('File uploaded successfully.');
      setUploadName('');
      setUploadDescription('');
      setUploadFile(null);
      setFileInputKey((k) => k + 1);
      await loadDocs();
      setTab('documents');
    } catch (err: unknown) {
      setUploadError(getErrorMessage(err, 'Upload failed.'));
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmDelete = async () => {
    const doc = deleteDialogDoc;
    if (!doc) return;
    setDeletingId(doc.id);
    setDeleteDialogError(null);
    try {
      await deleteUploaderUserDocument(apiClient, user.id, doc.id);
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      setDeleteDialogDoc(null);
      setDeleteSuccessDoc(doc);
    } catch (err: unknown) {
      setDeleteDialogError(getErrorMessage(err, 'Could not delete document.'));
    } finally {
      setDeletingId(null);
    }
  };

  const displayName = user.name?.trim() || user.email;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy-darkest/50 backdrop-blur-[2px] transition-opacity duration-200"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex max-h-[min(92vh,900px)] w-full max-w-lg flex-col rounded-t-2xl border border-border-soft bg-white shadow-2xl sm:rounded-2xl outline-none ring-2 ring-brand/15"
      >
        {deleteDialogDoc ? (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center rounded-t-2xl bg-navy-darkest/45 p-4 backdrop-blur-[2px] sm:rounded-2xl"
            role="presentation"
          >
            <div
              role="alertdialog"
              aria-labelledby="delete-doc-title"
              aria-describedby="delete-doc-desc"
              className="w-full max-w-sm rounded-2xl border border-border-soft bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <h3 id="delete-doc-title" className="text-lg font-bold text-foreground">
                Delete this document?
              </h3>
              <p id="delete-doc-desc" className="mt-3 text-sm leading-relaxed text-slate-600">
                <span className="font-semibold text-foreground">“{deleteDialogDoc.name}”</span> will
                be permanently removed from this user’s account, our database, and cloud storage
                (including S3). Shared access will end. This cannot be undone.
              </p>
              {deleteDialogError ? (
                <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  {deleteDialogError}
                </p>
              ) : null}
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={deletingId !== null}
                  onClick={() => setDeleteDialogDoc(null)}
                  className="rounded-xl border border-border-soft bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-surface-tint disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deletingId !== null}
                  onClick={() => void handleConfirmDelete()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-800 disabled:opacity-50"
                >
                  {deletingId === deleteDialogDoc.id ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : null}
                  Delete permanently
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {deleteSuccessDoc ? (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center rounded-t-2xl bg-navy-darkest/40 p-4 backdrop-blur-[1px] sm:rounded-2xl"
            role="presentation"
          >
            <div
              className="w-full max-w-sm rounded-2xl border border-emerald-200 bg-white p-6 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="text-emerald-600" size={32} strokeWidth={2} />
              </div>
              <p className="text-lg font-bold text-foreground">Document deleted</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                <span className="font-semibold text-foreground">“{deleteSuccessDoc.name}”</span> has
                been permanently removed from storage and our systems.
              </p>
              <button
                type="button"
                onClick={() => setDeleteSuccessDoc(null)}
                className="mt-6 w-full rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-hover"
              >
                OK
              </button>
            </div>
          </div>
        ) : null}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border-soft bg-gradient-to-br from-surface-tint/90 to-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-bold text-foreground truncate">
              {displayName}
            </h2>
            <p className="mt-1 text-sm text-slate-600 truncate">{user.email}</p>
            <p className="text-sm text-slate-500 truncate">Phone {user.phone}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl p-2 text-slate-500 transition-colors hover:bg-surface-tint hover:text-brand"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        <div className="shrink-0 border-b border-border-soft bg-white px-4 py-3 sm:px-6">
          <div className="flex gap-2 rounded-xl bg-surface-tint/70 p-1">
            <button
              type="button"
              onClick={() => setTab('documents')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                tab === 'documents'
                  ? 'bg-brand text-white shadow-md'
                  : 'text-slate-600 hover:text-brand'
              }`}
            >
              <FileText size={18} strokeWidth={2} />
              Documents
            </button>
            <button
              type="button"
              onClick={() => setTab('uploads')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                tab === 'uploads'
                  ? 'bg-brand text-white shadow-md'
                  : 'text-slate-600 hover:text-brand'
              }`}
            >
              <Upload size={18} strokeWidth={2} />
              Uploads
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {tab === 'documents' ? (
            <div className="space-y-3">
              {docsError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {docsError}
                </div>
              ) : null}
              {loadingDocs ? (
                <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
                  <Loader2 className="animate-spin" size={22} />
                  <span className="text-sm font-medium">Loading documents…</span>
                </div>
              ) : documents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border-soft bg-background px-5 py-10 text-center">
                  <p className="text-sm font-semibold text-foreground">No documents yet</p>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    Switch to <span className="font-semibold text-brand">Uploads</span> to add PDFs,
                    images, or office files for this user.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {documents.map((doc) => {
                    const status = documentStatusBadge(doc);
                    const openUrl = doc.file_url ?? undefined;
                    const isBusy = deletingId === doc.id;
                    return (
                      <li
                        key={doc.id}
                        className="rounded-xl border border-border-soft bg-white shadow-sm overflow-hidden"
                      >
                        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 gap-y-1">
                              <p className="font-semibold text-foreground break-words">{doc.name}</p>
                              <span
                                className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
                              >
                                {status.label}
                              </span>
                            </div>
                            {doc.description ? (
                              <p className="mt-1 text-sm text-slate-600 break-words">
                                {doc.description}
                              </p>
                            ) : null}
                            <p className="mt-2 text-xs text-slate-500">
                              {doc.original_name ?? 'File'} · {formatBytes(doc.size)}
                              {doc.uploaded_at
                                ? ` · ${new Date(doc.uploaded_at).toLocaleString(undefined, {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                  })}`
                                : ''}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 shrink-0">
                            {openUrl ? (
                              <a
                                href={openUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-border-soft bg-white px-3 py-2 text-sm font-semibold text-brand transition-colors hover:bg-surface-tint"
                              >
                                <ExternalLink size={16} />
                                Open
                              </a>
                            ) : null}
                            <button
                              type="button"
                              disabled={isBusy && deleteDialogDoc?.id === doc.id}
                              onClick={() => {
                                setDeleteDialogError(null);
                                setDeleteDialogDoc(doc);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800 transition-colors hover:bg-red-100 disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : (
            <form onSubmit={(e) => void handleUpload(e)} className="space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                PDFs, images, and office documents only. Video and audio files are not accepted.
              </p>
              {uploadError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {uploadError}
                </div>
              ) : null}
              {uploadOk ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  {uploadOk}
                </div>
              ) : null}
              <div>
                <label htmlFor="uploader-doc-name" className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                  Display name
                </label>
                <input
                  id="uploader-doc-name"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full rounded-xl border border-border-soft bg-surface-tint/40 px-4 py-3 text-base text-foreground outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20 focus:bg-white"
                  placeholder="e.g. Passport scan"
                  autoComplete="off"
                />
              </div>
              <div>
                <label
                  htmlFor="uploader-doc-desc"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5"
                >
                  Description <span className="font-normal normal-case text-slate-400">(optional)</span>
                </label>
                <textarea
                  id="uploader-doc-desc"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  rows={3}
                  className="w-full resize-y rounded-xl border border-border-soft bg-surface-tint/40 px-4 py-3 text-base text-foreground outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20 focus:bg-white"
                  placeholder="Short note for the user…"
                />
              </div>
              <div>
                <label htmlFor="uploader-doc-file" className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                  File
                </label>
                <input
                  key={fileInputKey}
                  id="uploader-doc-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,.odt,.ods,.png,.jpg,.jpeg,.gif,.webp,.bmp,.tiff,.tif,image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-hover"
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3.5 font-bold text-white shadow-md transition-all hover:bg-brand-hover hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Uploading…
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload document
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
