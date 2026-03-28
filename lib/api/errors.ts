import { isAxiosError } from 'axios';

export interface ApiErrorPayload {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Normalises Laravel / Axios errors into a single user-facing string.
 */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorPayload | undefined;
    if (data?.message && typeof data.message === 'string') {
      return data.message;
    }
    if (error.response?.status === 401) {
      return 'Invalid email or password.';
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

/**
 * Maps Laravel `errors` bag to a flat record (first message per field).
 */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (!isAxiosError(error)) {
    return {};
  }
  const data = error.response?.data as ApiErrorPayload | undefined;
  const raw = data?.errors;
  if (!raw || typeof raw !== 'object') {
    return {};
  }
  const out: Record<string, string> = {};
  for (const [key, messages] of Object.entries(raw)) {
    if (Array.isArray(messages) && messages[0]) {
      out[key] = String(messages[0]);
    }
  }
  return out;
}
