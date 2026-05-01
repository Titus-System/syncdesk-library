export enum AttendanceStatus {
  OPENED = "opened",
  IN_PROGRESS = "in_progress",
  FINISHED = "finished",
}

export interface AttendanceCompany {
  id: string;
  name: string;
}

export interface AttendanceClient {
  id: string;
  name: string;
  email: string;
  company?: AttendanceCompany;
}

export interface AttendanceResult {
  type: string;
  closure_message: string;
}

export interface AttendanceEvaluation {
  rating: number;
}

export interface TriageStepSchema {
  step: string;
  question: string;
  answer_value?: string;
  answer_text?: string;
}

export interface AttendanceResponse {
  triage_id: string;
  status: AttendanceStatus;
  start_date: string;
  end_date?: string;
  client: AttendanceClient;
  triage: TriageStepSchema[];
  result?: AttendanceResult;
  evaluation?: AttendanceEvaluation;
  needs_evaluation: boolean;
}

export interface QuickReply {
  label: string;
  value: string;
}

export interface TriageInputDef {
  mode: string;
  quick_replies?: QuickReply[];
}

export interface TriageResult {
  type: string;
  id: string;
  ticket_id?: string;
  chat_id?: string;
}

export interface TriageData {
  triage_id: string;
  step_id?: string;
  message?: string;
  input?: TriageInputDef;
  finished?: boolean;
  closure_message?: string;
  result?: TriageResult;
}

export interface TriageInputDTO {
  triage_id: string;
  step_id: string;
  answer_text?: string;
  answer_value?: string;
  client_id?: string;
  client_name?: string;
  client_email?: string;
}

export interface AttendanceSearchFiltersDTO {
  client_id?: string;
  client_name?: string;
  status?: AttendanceStatus;
  result_type?: string;
  start_date_from?: string;
  start_date_to?: string;
  has_evaluation?: boolean;
  rating?: number;
}

export interface EvaluationRequest {
  rating: number;
}

export interface EvaluationResponse {
  triage_id: string;
  rating: number;
  evaluated_at: string;
}
