import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiResponse } from "../../api";
import {
  Conversation,
  CreateConversationDTO,
  PaginatedMessages,
} from "../types/live_chat";

const PATH = "/conversations";

/**
 * Get all conversations of a ticket.
 * @param {string} ticket_id ticket_id parameter.
 * @returns {UseQueryResult<Conversation[]>} The query result.
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
 * Get a specific client's conversations.
 * @param {string} client_id client_id parameter.
 * @returns {UseQueryResult<Conversation[]>} The query result.
 */
export const useGetClientConversations = (client_id: string) => {
  return useQuery({
    queryKey: ["conversations", "client", client_id],
    queryFn: async (): Promise<Conversation[]> => {
      const response = await apiClient.get<ApiResponse<Conversation[]>>(
        `${PATH}/client/${client_id}`,
      );
      return response.data.data;
    },
    enabled: !!client_id,
  });
};

/**
 * Get ticket messages with pagination.
 * @param {string} ticket_id ticket_id parameter.
 * @param {number} page page parameter.
 * @param {number} limit limit parameter.
 * @returns {UseQueryResult<PaginatedMessages>} The query result.
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
 * Create a new conversation.
 * @param {CreateConversationDTO} dto The conversation creation details.
 * @returns {UseMutationResult<Conversation, Error, CreateConversationDTO>} The mutation result.
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
 * @param {{ chat_id: string; agent_id: string }} params The chat ID and agent ID payload.
 * @returns {UseMutationResult<void, Error, { chat_id: string; agent_id: string }>} The mutation result.
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
