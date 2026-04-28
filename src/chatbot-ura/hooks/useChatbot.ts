import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api";
import type { ApiResponse, PaginatedRequest } from "../../api/typings";
import type {
  AttendanceResponse,
  TriageData,
  TriageInputDTO,
  AttendanceSearchFiltersDTO,
  EvaluationRequest,
  EvaluationResponse,
} from "../types/chatbot";

const PATH = "/chatbot";

/**
 * Initiate a new attendance (triage session).
 * @returns {UseMutationResult<TriageData, Error, void>} The mutation result.
 */
export function useCreateAttendance() {
  const queryClient = useQueryClient();
  return useMutation<TriageData, Error, void>({
    mutationFn: async () => {
      const response = await apiClient.post<ApiResponse<TriageData>>(
        `${PATH}/`,
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate attendances list when a new one is created
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
    },
  });
}

/**
 * List attendances with optional filters and pagination.
 * @param {AttendanceSearchFiltersDTO & PaginatedRequest} params Search filters and pagination
 * @returns {UseQueryResult<AttendanceResponse[]>} The query result.
 */
export function useAttendances(
  params: AttendanceSearchFiltersDTO & PaginatedRequest = {},
) {
  return useQuery<AttendanceResponse[]>({
    queryKey: ["attendances", params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AttendanceResponse[]>>(
        `${PATH}/`,
        {
          params,
        },
      );
      return response.data.data;
    },
  });
}

/**
 * Send a message or interaction (answer) to the chatbot webhook.
 * @returns {UseMutationResult<TriageData, Error, TriageInputDTO>} The mutation result.
 */
export function useSendChatMessage() {
  const queryClient = useQueryClient();
  return useMutation<TriageData, Error, TriageInputDTO>({
    mutationFn: async (dto) => {
      const response = await apiClient.post<ApiResponse<TriageData>>(
        `${PATH}/webhook`,
        dto,
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      if (variables.triage_id) {
        queryClient.invalidateQueries({
          queryKey: ["attendances", variables.triage_id],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
    },
  });
}

/**
 * Get a specific attendance context by its triage ID.
 * @param {string} triageId The triage session identifier.
 * @returns {UseQueryResult<AttendanceResponse>} The query result.
 */
export function useAttendance(triageId: string) {
  return useQuery<AttendanceResponse>({
    queryKey: ["attendances", triageId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AttendanceResponse>>(
        `${PATH}/${triageId}`,
      );
      return response.data.data;
    },
    enabled: !!triageId,
  });
}

/**
 * Submit an evaluation rating (1-5) for a completed attendance session.
 * @returns {UseMutationResult<EvaluationResponse, Error, { triageId: string, payload: EvaluationRequest }>}
 */
export function useEvaluateAttendance() {
  const queryClient = useQueryClient();
  return useMutation<
    EvaluationResponse,
    Error,
    { triageId: string; payload: EvaluationRequest }
  >({
    mutationFn: async ({ triageId, payload }) => {
      const response = await apiClient.post<ApiResponse<EvaluationResponse>>(
        `${PATH}/${triageId}/evaluation`,
        payload,
      );
      return response.data.data;
    },
    onSuccess: (_, { triageId }) => {
      queryClient.invalidateQueries({ queryKey: ["attendances", triageId] });
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
    },
  });
}
