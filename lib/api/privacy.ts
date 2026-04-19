import type { AxiosInstance } from 'axios';

export interface DeleteAccountByCredentialsPayload {
  email: string;
  password: string;
  confirmation_text: string;
}

export interface DeleteAccountByCredentialsResponse {
  success: boolean;
  message: string;
}

export async function deleteAccountByCredentials(
  client: AxiosInstance,
  payload: DeleteAccountByCredentialsPayload
): Promise<DeleteAccountByCredentialsResponse> {
  const { data } = await client.post<DeleteAccountByCredentialsResponse>(
    '/privacy/delete-account',
    payload
  );
  return data;
}
