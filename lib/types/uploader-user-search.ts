export interface UploaderUserSearchHit {
  id: string;
  name: string | null;
  email: string;
  phone: string;
  email_verified_at: string | null;
  created_at: string | null;
}

export interface UploaderUserSearchResponse {
  user: UploaderUserSearchHit | null;
}
