import { useQuery } from "@tanstack/react-query";
import { apiClient, ApiResponse } from "../../api";
import type {
  PingResponse,
  HealthResponse,
  ReadyResponse,
} from "../types/health";

const PATH = "";

/**
 * Ping the server to check for basic connectivity.
 * @returns {UseQueryResult<PingResponse, Error>} The result.
 * GET /api/ping
 */
export const usePing = () => {
  return useQuery({
    queryKey: ["health", "ping"],
    queryFn: async (): Promise<PingResponse> => {
      const response = await apiClient.get<ApiResponse<PingResponse>>(
        `${PATH}/ping`,
      );
      return response.data.data;
    },
  });
};

/**
 * Check the detailed health of the server and its dependencies (e.g. databases).
 * @returns {UseQueryResult<HealthResponse, Error>} The result.
 * GET /api/health
 */
export const useHealth = () => {
  return useQuery({
    queryKey: ["health", "status"],
    queryFn: async (): Promise<HealthResponse> => {
      const response = await apiClient.get<ApiResponse<HealthResponse>>(
        `${PATH}/health`,
      );
      return response.data.data;
    },
  });
};

/**
 * Check if the server is ready to accept traffic.
 * @returns {UseQueryResult<ReadyResponse, Error>} The result.
 * GET /api/ready
 */
export const useReady = () => {
  return useQuery({
    queryKey: ["health", "ready"],
    queryFn: async (): Promise<ReadyResponse> => {
      const response = await apiClient.get<ApiResponse<ReadyResponse>>(
        `${PATH}/ready`,
      );
      return response.data.data;
    },
  });
};
