'use client';

import type { AxiosInstance } from 'axios';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createApiClient } from '@/lib/api/client';
import {
  fetchUploaderMe,
  loginUploader,
  logoutUploader,
  registerUploader,
  updateUploaderEmail,
  type UpdateUploaderEmailPayload,
} from '@/lib/api/uploader-auth';
import type { RegisterUploaderPayload, Uploader } from '@/lib/types/uploader';

const STORAGE_KEY = 'hammer_trust_uploader_token';

interface UploaderAuthContextValue {
  apiClient: AxiosInstance;
  uploader: Uploader | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<Uploader>;
  register: (payload: RegisterUploaderPayload) => Promise<Uploader>;
  logout: () => Promise<void>;
  refreshUploader: () => Promise<void>;
  changeUploaderEmail: (payload: UpdateUploaderEmailPayload) => Promise<void>;
}

const UploaderAuthContext = createContext<UploaderAuthContextValue | undefined>(undefined);

export function useUploaderAuth(): UploaderAuthContextValue {
  const ctx = useContext(UploaderAuthContext);
  if (!ctx) {
    throw new Error('useUploaderAuth must be used within UploaderAuthProvider');
  }
  return ctx;
}

function readStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

function persistToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem(STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function UploaderAuthProvider({ children }: { readonly children: ReactNode }) {
  const tokenRef = useRef<string | null>(null);
  const [uploader, setUploader] = useState<Uploader | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const client = useMemo(
    () => createApiClient(() => tokenRef.current),
    []
  );

  const bootstrap = useCallback(async () => {
    const stored = readStoredToken();
    if (!stored) {
      tokenRef.current = null;
      setToken(null);
      setUploader(null);
      setIsLoading(false);
      return;
    }
    tokenRef.current = stored;
    setToken(stored);
    try {
      const me = await fetchUploaderMe(client);
      setUploader(me);
    } catch {
      tokenRef.current = null;
      setToken(null);
      setUploader(null);
      persistToken(null);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginUploader(client, email, password);
      tokenRef.current = result.token;
      setToken(result.token);
      persistToken(result.token);
      setUploader(result.uploader);
      return result.uploader;
    },
    [client]
  );

  const register = useCallback(
    async (payload: RegisterUploaderPayload) => {
      const result = await registerUploader(client, payload);
      tokenRef.current = result.token;
      setToken(result.token);
      persistToken(result.token);
      setUploader(result.uploader);
      return result.uploader;
    },
    [client]
  );

  const refreshUploader = useCallback(async () => {
    if (!tokenRef.current) return;
    const me = await fetchUploaderMe(client);
    setUploader(me);
  }, [client]);

  const changeUploaderEmail = useCallback(
    async (payload: UpdateUploaderEmailPayload) => {
      const result = await updateUploaderEmail(client, payload);
      setUploader(result.uploader);
    },
    [client]
  );

  const logout = useCallback(async () => {
    try {
      if (tokenRef.current) {
        await logoutUploader(client);
      }
    } catch {
      // Still clear local session if the token was already invalid.
    } finally {
      tokenRef.current = null;
      setToken(null);
      setUploader(null);
      persistToken(null);
    }
  }, [client]);

  const value = useMemo<UploaderAuthContextValue>(
    () => ({
      apiClient: client,
      uploader,
      token,
      isLoading,
      login,
      register,
      logout,
      refreshUploader,
      changeUploaderEmail,
    }),
    [
      client,
      uploader,
      token,
      isLoading,
      login,
      register,
      logout,
      refreshUploader,
      changeUploaderEmail,
    ]
  );

  return (
    <UploaderAuthContext.Provider value={value}>{children}</UploaderAuthContext.Provider>
  );
}
