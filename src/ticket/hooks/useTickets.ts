import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiResponse } from "../../api";
import {
  CreateTicketRequest,
  CreateTicketResponse,
  TicketResponse,
  TicketSearchFilters,
  UpdateTicketStatusRequest,
  UpdateTicketStatusResponse,
} from "../types/ticket";

const PATH = "/tickets";

// Query keys
export const TICKET_KEYS = {
  all: ["tickets"] as const,
  list: (filters: TicketSearchFilters) =>
    [...TICKET_KEYS.all, "list", filters] as const,
};

/**
 * Get all tickets.
 * @param {TicketSearchFilters} filters filters parameter.
 * @returns {UseQueryResult<TicketResponse[]>} The query result.
 */
export const useTickets = (filters: TicketSearchFilters = {}) => {
  return useQuery({
    queryKey: TICKET_KEYS.list(filters),
    queryFn: async (): Promise<TicketResponse[]> => {
      const response = await apiClient.get<ApiResponse<TicketResponse[]>>(
        `${PATH}/`,
        { params: filters },
      );
      return response.data.data;
    },
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
