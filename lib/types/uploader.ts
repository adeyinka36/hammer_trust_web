export interface Uploader {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string | null;
  crn: string;
  address: string;
  phone: string;
  verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface UploaderAuthSuccess {
  message: string;
  uploader: Uploader;
  token: string;
  token_type: 'Bearer';
}

export interface UploaderMeResponse {
  uploader: Uploader;
}

export interface RegisterUploaderPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  crn: string;
  address: string;
  phone: string;
}
