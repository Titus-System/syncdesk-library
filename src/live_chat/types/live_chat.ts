export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string | "System";
  timestamp: string;
  type: "text" | "file";
  content: string;
  mime_type?: string | null;
  filename?: string | null;
  responding_to?: string | null;
}

export interface Conversation {
  _id: string;
  ticket_id: string;
  agent_id?: string | null;
  client_id: string;
  sequential_index: number;
  parent_id?: string | null;
  children_ids: string[];
  started_at: string;
  finished_at?: string | null;
  messages: ChatMessage[];
}

export interface CreateConversationDTO {
  ticket_id: string;
  agent_id?: string | null;
  client_id: string;
  sequential_index?: number;
  parent_id?: string | null;
}

export interface PaginatedMessages {
  messages: ChatMessage[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
}
