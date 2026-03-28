export interface UploaderDocument {
  id: string;
  name: string;
  description: string | null;
  file_url: string | null;
  active?: boolean;
  declined_at?: string | null;
  mime_type?: string | null;
  original_name?: string | null;
  size?: number | null;
  uploaded_at: string | null;
  created_at: string | null;
}

export interface UploaderDocumentsListResponse {
  documents: UploaderDocument[];
}

export interface UploaderDocumentUploadResponse {
  message: string;
  document: UploaderDocument;
}
