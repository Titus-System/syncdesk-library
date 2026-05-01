export type TicketType = "issue" | "access" | "new_feature";
export type TicketCriticality = "high" | "medium" | "low";
export type TicketStatus =
  | "open"
  | "awaiting_assignment"
  | "in_progress"
  | "waiting_for_provider"
  | "waiting_for_validation"
  | "finished";

export interface TicketPaginatedList<T> {
  total: number;
  page: number;
  page_size: number;
  items: T[];
}

export interface CreateTicketRequest {
  triage_id: string;
  type: TicketType;
  criticality: TicketCriticality;
  product: string;
  description: string;
  chat_ids?: string[];
  client_id: string;
  company_id?: string;
  company_name?: string;
}

export interface CreateTicketResponse {
  id: string;
  status: TicketStatus;
  creation_date: string;
}

export interface TicketSearchFilters {
  page?: number;
  page_size?: number;
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
  exit_date?: string;
  transfer_reason?: string;
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
  assigned_agent_id?: string;
  assigned_agent_name?: string;
}

export interface TicketQueueFilters {
  page?: number;
  page_size?: number;
  status?: TicketStatus;
  type?: TicketType;
  department_id?: string;
  unassigned_only?: boolean;
  level?: string;
  assignee_id?: string;
}

export interface TicketQueueItemResponse {
  id: string;
  triage_id: string;
  type: TicketType;
  criticality: TicketCriticality;
  product: string;
  status: TicketStatus;
  creation_date: string;
  description: string;
  client: TicketClientResponse;
  department_id?: string;
  department_name?: string;
  level?: string;
  assignee_id?: string;
  assignee_name?: string;
  unassigned: boolean;
}

export interface TicketQueueListResponse {
  items: TicketQueueItemResponse[];
  page: number;
  page_size: number;
  total: number;
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
}

export interface UpdateTicketStatusResponse {
  id: string;
  previous_status: TicketStatus;
  current_status: TicketStatus;
}

// --- Ticket Comments ---
export interface AddTicketCommentRequest {
  text: string;
  internal?: boolean;
}

export interface UpdateTicketCommentRequest {
  author?: string;
  text?: string;
  internal?: boolean;
}

// --- Actions ---
export interface AssignTicketRequest {
  agent_id: string;
  reason?: string;
}

export interface EscalateTicketRequest {
  target_agent_id: string;
  reason: string;
}

export interface TransferTicketRequest {
  target_agent_id: string;
  reason: string;
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  criticality?: TicketCriticality;
  product?: string;
  description?: string;
}
