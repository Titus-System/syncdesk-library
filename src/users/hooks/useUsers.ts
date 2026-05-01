import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiResponse } from "../../api";
import {
  User,
  CreateUserDTO,
  ReplaceUserDTO,
  UpdateUserDTO,
  AddUserRolesDTO,
  RemoveUserRolesDTO,
  UpdateUserRolesDTO,
} from "../types/user";

const PATH = "/users";

/**
 * Get all users.
 * @returns {UseQueryResult<User[]>} The query result.
 * GET /api/users/
 */
export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const response = await apiClient.get<ApiResponse<User[]>>(PATH);
      return response.data.data;
    },
    // staleTime: // ms
    // gcTime: ,  //
  });
};

/**
 * Get one user.
 * @param {string} id id parameter.
 * @returns {UseQueryResult<User>} The query result.
 * GET /api/users/{id}
 */
export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get<ApiResponse<User>>(`${PATH}/${id}`);
      return response.data.data;
    },
    enabled: !!id, // Prevent the query from running if the ID is missing
  });
};

/**
 * Create a user.
 * @param {CreateUserDTO} user The user creation details.
 * @returns {UseMutationResult<User, Error, CreateUserDTO>} The mutation result.
 * POST /api/users/
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: CreateUserDTO): Promise<User> => {
      const response = await apiClient.post<ApiResponse<User>>(PATH, user);
      return response.data.data;
    },
    // Tell React Query to refresh the 'users' list after a successful creation.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

/**
 * Replace an entire user.
 * @param {{ id: string; data: ReplaceUserDTO }} params The ID and user replacement data.
 * @returns {UseMutationResult<User, Error, { id: string; data: ReplaceUserDTO }>} The mutation result.
 * PUT /api/users/{id}
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ReplaceUserDTO;
    }): Promise<User> => {
      const response = await apiClient.put<ApiResponse<User>>(
        `${PATH}/${id}`,
        data,
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
    },
  });
};

/**
 * Update specific fields of a user.
 * @param {{ id: string; data: UpdateUserDTO }} params The ID and user update data.
 * @returns {UseMutationResult<User, Error, { id: string; data: UpdateUserDTO }>} The mutation result.
 * PATCH /api/users/{id}
 */
export const usePatchUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateUserDTO;
    }): Promise<User> => {
      const response = await apiClient.patch<ApiResponse<User>>(
        `${PATH}/${id}`,
        data,
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
    },
  });
};

/**
 * Add roles to a user.
 * @param {{ id: string; data: AddUserRolesDTO }} params The ID and user roles data.
 * @returns {UseMutationResult<User, Error, { id: string; data: AddUserRolesDTO }>} The mutation result.
 * POST /api/users/{id}/roles
 */
export const useAddUserRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: AddUserRolesDTO;
    }): Promise<User> => {
      const response = await apiClient.post<ApiResponse<User>>(
        `${PATH}/${id}/roles`,
        data,
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
    },
  });
};

/**
 * Remove roles from a user.
 * @param {{ id: string; data: RemoveUserRolesDTO }} params The ID and roles to remove.
 * @returns {UseMutationResult<User, Error, { id: string; data: RemoveUserRolesDTO }>} The mutation result.
 * DELETE /api/users/{id}/roles
 */
export const useRemoveUserRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RemoveUserRolesDTO }): Promise<User> => {
      const response = await apiClient.delete<ApiResponse<User>>(`${PATH}/${id}/roles`, {
        data,
      });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
    },
  });
};

/**
 * Update a user's roles (add/remove lists).
 * @param {{ id: string; data: UpdateUserRolesDTO }} params The ID and roles changes.
 * @returns {UseMutationResult<User, Error, { id: string; data: UpdateUserRolesDTO }>} The mutation result.
 * PATCH /api/users/{id}/roles
 */
export const useUpdateUserRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserRolesDTO }): Promise<User> => {
      const response = await apiClient.patch<ApiResponse<User>>(`${PATH}/${id}/roles`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
    },
  });
};
