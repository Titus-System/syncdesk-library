export interface PingResponse {
  message: string;
}

export interface HealthResponse {
  postgres_status: "connected" | "degraded";
  mongo_status: "connected" | "degraded";
}

export interface ReadyResponse {}
