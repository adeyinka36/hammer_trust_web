import type { AxiosInstance } from 'axios';
import type { UploaderUserSearchResponse } from '@/lib/types/uploader-user-search';

export async function searchUploaderUsers(
  client: AxiosInstance,
  q: string
): Promise<UploaderUserSearchResponse> {
  const { data } = await client.get<UploaderUserSearchResponse>('/uploaders/users/search', {
    params: { q: q.trim() },
  });
  return data;
}
