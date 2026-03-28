'use client';

import React, { useCallback, useState } from 'react';
import { Loader2, Search, UserRound } from 'lucide-react';
import { useUploaderAuth } from '@/context/UploaderAuthContext';
import { searchUploaderUsers } from '@/lib/api/uploader-user-search';
import { getErrorMessage } from '@/lib/api/errors';
import type { UploaderUserSearchHit } from '@/lib/types/uploader-user-search';
import UploaderUserWorkspaceModal from '@/components/dashboard/UploaderUserWorkspaceModal';

export default function UploaderUserSearch() {
  const { apiClient } = useUploaderAuth();
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchedUser, setMatchedUser] = useState<UploaderUserSearchHit | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [workspaceUser, setWorkspaceUser] = useState<UploaderUserSearchHit | null>(null);

  const runSearch = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setError(null);
      const term = q.trim();
      if (term.length < 3) {
        setError('Enter at least 3 characters (full email or full phone as stored).');
        setMatchedUser(null);
        setHasSearched(false);
        return;
      }
      setLoading(true);
      setHasSearched(false);
      try {
        const { user } = await searchUploaderUsers(apiClient, term);
        setMatchedUser(user);
        setHasSearched(true);
      } catch (err: unknown) {
        setMatchedUser(null);
        setHasSearched(true);
        setError(getErrorMessage(err, 'Search failed. Try again.'));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, q]
  );

  const openWorkspace = (user: UploaderUserSearchHit) => {
    setWorkspaceUser(user);
  };

  const showEmpty = hasSearched && !loading && !matchedUser && !error;

  return (
    <section className="rounded-2xl border border-border-soft bg-white shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md">
      <div className="px-6 sm:px-8 py-6 sm:py-8 border-b border-border-soft bg-gradient-to-br from-surface-tint/80 to-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <UserRound size={22} strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm text-slate-600 mt-0.5">
              Search by <span className="font-semibold text-foreground">exact email</span> or{' '}
              <span className="font-semibold text-foreground">exact phone number</span> as stored on
              the account. You will see one match or none.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={runSearch} className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <label htmlFor="uploader-user-q" className="sr-only">
              Search users by email or phone
            </label>
            <input
              id="uploader-user-q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Full email or full phone number…"
              autoComplete="off"
              className="w-full rounded-xl border border-border-soft bg-surface-tint/50 px-4 py-3.5 pl-12 text-base text-foreground placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:bg-white"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={20}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-8 py-3.5 font-bold text-white shadow-md transition-all duration-200 hover:bg-brand-hover hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Searching
              </>
            ) : (
              <>
                <Search size={20} />
                Search
              </>
            )}
          </button>
        </div>

        <div
          className={`mt-5 min-h-[4.5rem] transition-all duration-300 ease-out ${
            error || showEmpty || (hasSearched && matchedUser)
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-1 pointer-events-none'
          }`}
        >
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
              {error}
            </div>
          ) : null}

          {showEmpty ? (
            <div className="rounded-xl border border-dashed border-border-soft bg-background px-5 py-8 text-center transition-all duration-300">
              <p className="text-sm font-semibold text-foreground">No matching user</p>
              <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                The email or phone must match exactly (including country code or formatting if that is
                how it was saved). If you use an email, it must be a valid address.
              </p>
            </div>
          ) : null}

          {hasSearched && matchedUser ? (
            <button
              type="button"
              onClick={() => openWorkspace(matchedUser)}
              className="w-full text-left rounded-xl border border-emerald-200/90 bg-emerald-50/90 px-4 py-4 sm:px-5 sm:py-4 shadow-sm transition-all duration-200 hover:border-brand/40 hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900/80">
                Match found — tap to open
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {matchedUser.name?.trim() || matchedUser.email}
              </p>
              <p className="text-sm text-slate-600 mt-0.5">{matchedUser.email}</p>
              <p className="text-sm text-slate-600">Phone {matchedUser.phone}</p>
            </button>
          ) : null}
        </div>
      </form>

      {workspaceUser ? (
        <UploaderUserWorkspaceModal
          user={workspaceUser}
          onClose={() => setWorkspaceUser(null)}
          apiClient={apiClient}
        />
      ) : null}
    </section>
  );
}
