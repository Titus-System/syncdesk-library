import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiResponse } from "../../api";
import {
  CreateTicketRequest,
  CreateTicketResponse,
  TicketPaginatedList,
  TicketResponse,
  TicketSearchFilters,
  TicketQueueFilters,
  TicketQueueListResponse,
  UpdateTicketStatusRequest,
  UpdateTicketStatusResponse,
  AddTicketCommentRequest,
  UpdateTicketCommentRequest,
  AssignTicketRequest,
  EscalateTicketRequest,
  TransferTicketRequest,
  UpdateTicketRequest,
} from "../types/ticket";

const PATH = "/tickets";

// Query keys definition for react-query.
export const TICKET_KEYS = {
  all: ["tickets"] as const,
  list: (filters: TicketSearchFilters) =>
    [...TICKET_KEYS.all, "list", filters] as const,
  queue: (filters: TicketQueueFilters) =>
    [...TICKET_KEYS.all, "queue", filters] as const,
  detail: (ticketId: string) =>
    [...TICKET_KEYS.all, "detail", ticketId] as const,
  comments: (ticketId: string) =>
    [...TICKET_KEYS.detail(ticketId), "comments"] as const,
};

/**
 * Get all tickets (paginated).
 * @param {TicketSearchFilters} filters filters parameter.
 * @returns {UseQueryResult<TicketPaginatedList<TicketResponse>>} The query result.
 * GET /api/tickets/
 */
export const useTickets = (filters: TicketSearchFilters = {}) => {
  return useQuery({
    queryKey: TICKET_KEYS.list(filters),
    queryFn: async (): Promise<TicketPaginatedList<TicketResponse>> => {
      const response = await apiClient.get<
        ApiResponse<TicketPaginatedList<TicketResponse>>
      >(`${PATH}/`, { params: filters });
      return response.data.data;
    },
  });
};

/**
 * Get ticket queue.
 * @param {TicketQueueFilters} filters queue filters.
 * @returns {UseQueryResult<TicketQueueListResponse>} The query result.
 * GET /api/tickets/queue
 */
export const useTicketQueue = (filters: TicketQueueFilters = {}) => {
  return useQuery({
    queryKey: TICKET_KEYS.queue(filters),
    queryFn: async (): Promise<TicketQueueListResponse> => {
      const response = await apiClient.get<
        ApiResponse<TicketQueueListResponse>
      >(`${PATH}/queue`, { params: filters });
      return response.data.data;
    },
  });
};

/**
 * Get a specific ticket by its ID.
 * @param {string} ticketId filter parameter.
 * @returns {UseQueryResult<TicketResponse>} The query result.
 * GET /api/tickets/{ticket_id}
 */
export const useTicket = (ticketId: string) => {
  return useQuery({
    queryKey: TICKET_KEYS.detail(ticketId),
    queryFn: async (): Promise<TicketResponse> => {
      const response = await apiClient.get<ApiResponse<TicketResponse>>(
        `${PATH}/${ticketId}`,
      );
      return response.data.data;
    },
    enabled: !!ticketId,
  });
};

/**
 * Create a new ticket.
 * @param {CreateTicketRequest} payload The ticket creation details.
 * @returns {UseMutationResult<CreateTicketResponse, Error, CreateTicketRequest>} The mutation result.
 * POST /api/tickets/
 */
export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: CreateTicketRequest,
    ): Promise<CreateTicketResponse> => {
      const response = await apiClient.post<ApiResponse<CreateTicketResponse>>(
        `${PATH}/`,
        payload,
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate tickets list queries on success
      queryClient.invalidateQueries({ queryKey: TICKET_KEYS.all });
    },
  });
};

/**
 * Update a ticket's status.
 * @param {{ ticketId: string; payload: UpdateTicketStatusRequest }} params The ticket ID and status update payload.
 * @returns {UseMutationResult<UpdateTicketStatusResponse, Error, { ticketId: string; payload: UpdateTicketStatusRequest }>} The mutation result.
 * @deprecated This endpoint is deprecated. Use `useUpdateTicket` instead for more flexible updates.
 * PATCH /api/tickets/{ticket_id}/status
 */
export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      payload,
    }: {
      ticketId: string;
      payload: UpdateTicketStatusRequest;
    }): Promise<UpdateTicketStatusResponse> => {
      const response = await apiClient.patch<
        ApiResponse<UpdateTicketStatusResponse>
      >(`${PATH}/${ticketId}/status`, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_KEYS.all });
    },
  });
};

/**
 * Add a comment to a ticket.
 * POST /api/tickets/{ticket_id}/comments
 */
export const useAddTicketComment = (ticketId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddTicketCommentRequest) => {
      const response = await apiClient.post<ApiResponse<any>>(
        `${PATH}/${ticketId}/comments`,
        payload,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TICKET_KEYS.comments(ticketId),
      });
    },
  });
};

/**
 * List comments for a ticket.
 * GET /api/tickets/{ticket_id}/comments
 */
export const useTicketComments = (ticketId: string) => {
  return useQuery({
    queryKey: TICKET_KEYS.comments(ticketId),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<any[]>>(
        `${PATH}/${ticketId}/comments`,
      );
      return response.data.data;
    },
    enabled: !!ticketId,
  });
};

/**
 * Update a ticket comment.
 * PATCH /api/tickets/{ticket_id}/comments/{comment_id}
 */
export const useUpdateTicketComment = (ticketId: string, commentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateTicketCommentRequest) => {
      const response = await apiClient.patch<ApiResponse<any>>(
        `${PATH}/${ticketId}/comments/${commentId}`,
        payload,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TICKET_KEYS.comments(ticketId),
      });
    },
  });
};

/**
 * Delete a ticket comment.
 * DELETE /api/tickets/{ticket_id}/comments/{comment_id}
 */
export const useDeleteTicketComment = (ticketId: string, commentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete<ApiResponse<any>>(
        `${PATH}/${ticketId}/comments/${commentId}`,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TICKET_KEYS.comments(ticketId),
      });
    },
  });
};

/**
 * Assign a ticket to an agent.
 * POST /api/tickets/{ticket_id}/assign
 */
export const useAssignTicket = (ticketId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AssignTicketRequest) => {
      const response = await apiClient.post<ApiResponse<TicketResponse>>(
        `${PATH}/${ticketId}/assign`,
        payload,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_KEYS.detail(ticketId) });
    },
  });
};

/**
 * Escalate a ticket.
 * POST /api/tickets/{ticket_id}/escalate
 */
export const useEscalateTicket = (ticketId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: EscalateTicketRequest) => {
      const response = await apiClient.post<ApiResponse<TicketResponse>>(
        `${PATH}/${ticketId}/escalate`,
        payload,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_KEYS.detail(ticketId) });
    },
  });
};

/**
 * Transfer a ticket to another agent.
 * POST /api/tickets/{ticket_id}/transfer
 */
export const useTransferTicket = (ticketId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TransferTicketRequest) => {
      const response = await apiClient.post<ApiResponse<TicketResponse>>(
        `${PATH}/${ticketId}/transfer`,
        payload,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_KEYS.detail(ticketId) });
    },
  });
};

/**
 * Take a ticket (assign to self).
 * POST /api/tickets/{ticket_id}/take
 */
export const useTakeTicket = (ticketId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<ApiResponse<TicketResponse>>(
        `${PATH}/${ticketId}/take`,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_KEYS.detail(ticketId) });
    },
  });
};

/**
 * Partially update a ticket (fields like product, description, criticality, status).
 * PATCH /api/tickets/{ticket_id}
 */
export const useUpdateTicket = (ticketId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateTicketRequest) => {
      const response = await apiClient.patch<ApiResponse<TicketResponse>>(
        `${PATH}/${ticketId}`,
        payload,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_KEYS.detail(ticketId) });
    },
  });
};
