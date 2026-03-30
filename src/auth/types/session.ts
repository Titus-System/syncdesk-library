export type Status = "active" | "expired" | "invalid" | "revoked";

export interface Session {
  id: string;
  user_id: string;
  refresh_token_hash: string;
  status: Status;
  device_info: Record<string, unknown>;
  expires_at: Date | string;
  last_used_at: Date | string;
  revoked_at: Date | string;
}
