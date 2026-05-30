export type FileContext = "live_chat_message" | "user_avatar";
export type FileStatus = "pending" | "uploaded" | "failed";

export interface PresignUploadRequest {
  filename: string;
  content_type: string;
  size_bytes: number;
  context: FileContext;
  context_ref?: Record<string, string>;
}

export interface PresignUploadResponse {
  file_id: string;
  upload_url: string;
  method: "POST" | "PUT";
  fields: Record<string, string>;
  expires_at: string;
  max_size_bytes: number;
}

export interface ConfirmUploadResponse {
  file_id: string;
  status: FileStatus;
}

export interface DownloadUrlResponse {
  url: string;
  expires_at: string;
}

export interface FileRead {
  id: string;
  original_filename: string;
  content_type: string;
  size_bytes: number;
  context: FileContext;
  status: FileStatus;
  uploaded_at: string | null;
}
