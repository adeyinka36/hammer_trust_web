/**
 * Hammer Trust API base URL (includes `/api/v1`).
 * Must match `hammer-trust-backend` route prefix.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, '');
  }
  return 'http://localhost:8080/api/v1';
}
