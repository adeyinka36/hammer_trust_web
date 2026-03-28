import type { AxiosInstance } from 'axios';
import type {
  RegisterUploaderPayload,
  Uploader,
  UploaderAuthSuccess,
  UploaderMeResponse,
} from '@/lib/types/uploader';

export async function loginUploader(
  client: AxiosInstance,
  email: string,
  password: string
): Promise<UploaderAuthSuccess> {
  const { data } = await client.post<UploaderAuthSuccess>('/uploaders/login', {
    email,
    password,
  });
  return data;
}

export async function registerUploader(
  client: AxiosInstance,
  payload: RegisterUploaderPayload
): Promise<UploaderAuthSuccess> {
  const { data } = await client.post<UploaderAuthSuccess>('/uploaders/register', payload);
  return data;
}

export async function fetchUploaderMe(client: AxiosInstance): Promise<Uploader> {
  const { data } = await client.get<UploaderMeResponse>('/uploaders/me');
  return data.uploader;
}

export interface UpdateUploaderEmailPayload {
  email: string;
  email_confirmation: string;
}

export interface UpdateUploaderEmailResponse {
  message: string;
  uploader: Uploader;
}

export async function updateUploaderEmail(
  client: AxiosInstance,
  payload: UpdateUploaderEmailPayload
): Promise<UpdateUploaderEmailResponse> {
  const { data } = await client.put<UpdateUploaderEmailResponse>('/uploaders/email', payload);
  return data;
}

export async function logoutUploader(client: AxiosInstance): Promise<void> {
  await client.post('/uploaders/logout', {});
}
