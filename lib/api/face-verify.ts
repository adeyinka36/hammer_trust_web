import type { AxiosInstance } from 'axios';

export interface VerifyFaceMatch {
  id: string;
  email: string;
  similarity: number | null;
}

export interface VerifyFaceResponse {
  success: boolean;
  message: string;
  user: VerifyFaceMatch | null;
}

export interface ResolveSecretResponse {
  success: boolean;
  message: string;
  bind_id: string;
  expires_in: number;
}

/** Validate code and create a short-lived hard bind (no Rekognition). */
export async function resolveSecretBind(
  client: AxiosInstance,
  secret: string
): Promise<ResolveSecretResponse> {
  const { data } = await client.post<ResolveSecretResponse>('/secrets/resolve', {
    secret: secret.trim(),
  });
  return data;
}

export async function verifyFaceByBind(
  client: AxiosInstance,
  payload: { bindId: string; image: File }
): Promise<VerifyFaceResponse> {
  const formData = new FormData();
  formData.append('bind_id', payload.bindId);
  formData.append('image', payload.image);
  const { data } = await client.post<VerifyFaceResponse>('/verify/search-by-face', formData);
  return data;
}

/** @deprecated Prefer resolveSecretBind + verifyFaceByBind. */
export async function verifyFaceByCode(
  client: AxiosInstance,
  payload: { secret: string; image: File }
): Promise<VerifyFaceResponse> {
  const formData = new FormData();
  formData.append('secret', payload.secret.trim());
  formData.append('image', payload.image);
  const { data } = await client.post<VerifyFaceResponse>('/verify/search-by-face', formData);
  return data;
}
