import type { AxiosInstance } from 'axios';
import type {
  UploaderDocumentUploadResponse,
  UploaderDocumentsListResponse,
} from '@/lib/types/uploader-documents';

export async function fetchUploaderUserDocuments(
  client: AxiosInstance,
  userId: string
): Promise<UploaderDocumentsListResponse> {
  const { data } = await client.get<UploaderDocumentsListResponse>(
    `/uploaders/users/${userId}/documents`
  );
  return data;
}

export async function uploadUploaderUserDocument(
  client: AxiosInstance,
  userId: string,
  payload: { name: string; description?: string; file: File }
): Promise<UploaderDocumentUploadResponse> {
  const form = new FormData();
  form.append('name', payload.name);
  if (payload.description?.trim()) {
    form.append('description', payload.description.trim());
  }
  form.append('file', payload.file);
  const { data } = await client.post<UploaderDocumentUploadResponse>(
    `/uploaders/users/${userId}/documents`,
    form
  );
  return data;
}

export async function deleteUploaderUserDocument(
  client: AxiosInstance,
  userId: string,
  documentId: string
): Promise<void> {
  await client.delete(`/uploaders/users/${userId}/documents/${documentId}`);
}
