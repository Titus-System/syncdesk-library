export type TicketType = "issue" | "access" | "new_feature";
export type TicketCriticality = "high" | "medium" | "low";
export type TicketStatus =
  | "open"
  | "in_progress"
  | "waiting_for_provider"
  | "waiting_for_validation"
  | "finished";

export interface CreateTicketRequest {
  triage_id: string; // PydanticObjectId as string
  type: TicketType;
  criticality: TicketCriticality;
  product: string;
  description: string;
  chat_ids: string[]; // List of PydanticObjectId as string
  client_id: string; // UUID as string
}

export interface CreateTicketResponse {
  id: string;
  status: TicketStatus;
  creation_date: string; // ISO datetime
}

export interface TicketSearchFilters {
  ticket_id?: string;
  client_id?: string;
  triage_id?: string;
  status?: TicketStatus;
  criticality?: TicketCriticality;
  type?: TicketType;
  product?: string;
}

export interface TicketCompanyResponse {
  id: string;
  name: string;
}

export interface TicketClientResponse {
  id: string;
  name: string;
  email: string;
  company: TicketCompanyResponse;
}

export interface TicketHistoryResponse {
  agent_id: string;
  name: string;
  level: string;
  assignment_date: string;
  exit_date: string;
  transfer_reason: string;
}

export interface TicketCommentResponse {
  comment_id: string;
  author: string;
  text: string;
  date: string;
  internal: boolean;
}

export interface TicketResponse {
  id: string;
  triage_id: string;
  type: TicketType;
  criticality: TicketCriticality;
  product: string;
  status: TicketStatus;
  creation_date: string;
  description: string;
  chat_ids: string[];
  agent_history: TicketHistoryResponse[];
  client: TicketClientResponse;
  comments: TicketCommentResponse[];
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
}

export interface UpdateTicketStatusResponse {
  id: string;
  previous_status: TicketStatus;
  current_status: TicketStatus;
}
