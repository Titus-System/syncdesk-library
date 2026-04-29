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
};

/**
 * Get all tickets (paginated).
 * @param {TicketSearchFilters} filters filters parameter.
 * @returns {UseQueryResult<TicketPaginatedList<TicketResponse>>} The query result.
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
