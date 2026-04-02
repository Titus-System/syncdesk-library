import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiResponse } from "../../api";
import {
  Conversation,
  CreateConversationDTO,
  PaginatedMessages,
} from "../types/live_chat";

const PATH = "/conversations";

/**
 * Get all conversations recursively mapping to a ticket.
 * @param ticket_id
 */
export const useGetConversations = (ticket_id: string) => {
  return useQuery({
    queryKey: ["conversations", "ticket", ticket_id],
    queryFn: async (): Promise<Conversation[]> => {
      const response = await apiClient.get<ApiResponse<Conversation[]>>(
        `${PATH}/ticket/${ticket_id}`,
      );
      return response.data.data;
    },
    enabled: !!ticket_id,
  });
};

/**
 * Get paginated messages for a ticket.
 * @param ticket_id
 * @param page
 * @param limit
 */
export const useGetPaginatedMessages = (
  ticket_id: string,
  page = 1,
  limit = 10,
) => {
  return useQuery({
    queryKey: [
      "conversations",
      "ticket",
      ticket_id,
      "messages",
      { page, limit },
    ],
    queryFn: async (): Promise<PaginatedMessages> => {
      const response = await apiClient.get<ApiResponse<PaginatedMessages>>(
        `${PATH}/ticket/${ticket_id}/messages`,
        { params: { page, limit } },
      );
      return response.data.data;
    },
    enabled: !!ticket_id,
  });
};

/**
 * Create a new conversation mapping to a ticket.
 */
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateConversationDTO): Promise<Conversation> => {
      const response = await apiClient.post<ApiResponse<Conversation>>(
        PATH,
        dto,
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", "ticket", variables.ticket_id],
      });
    },
  });
};

/**
 * Assign an agent to a conversation.
 */
export const useSetConversationAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chat_id,
      agent_id,
    }: {
      chat_id: string;
      agent_id: string;
    }): Promise<void> => {
      await apiClient.patch(`${PATH}/${chat_id}/set-agent/${agent_id}`);
    },
    // We invalidate the ticket conversations here.
    // To do so effectively, you may need the ticket_id, but the mutation only receives the chat_id.
    // If ticket list invalidation is required, invalidate the whole 'conversations' key.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
