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
