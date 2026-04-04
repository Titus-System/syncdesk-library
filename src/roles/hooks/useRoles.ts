import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiResponse } from "../../api";
import type {
  Role,
  CreateRoleDTO,
  ReplaceRoleDTO,
  UpdateRoleDTO,
  AddRolePermissionsDTO,
} from "../types/role";

const PATH = "/roles";

/**
 * List all roles.
 * @returns {UseQueryResult<Role[]>} The query result.
 */
export function useRoles() {
  return useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Role[]>>(`${PATH}/`);
      return response.data.data;
    },
  });
}

/**
 * Get a role by ID.
 * @param {number} id id parameter.
 * @returns {UseQueryResult<Role>} The query result.
 */
export function useRole(id: number) {
  return useQuery<Role>({
    queryKey: ["roles", id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Role>>(`${PATH}/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

/**
 * Create a new role.
 * @param {CreateRoleDTO} dto DTO containing details.
 * @returns {UseMutationResult<Role, Error, CreateRoleDTO>} The mutation result.
 */
export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, CreateRoleDTO>({
    mutationFn: async (dto) => {
      const response = await apiClient.post<ApiResponse<Role>>(`${PATH}/`, dto);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

/**
 * Replace a role by ID.
 * @param {number} id ID.
 * @param {ReplaceRoleDTO} dto DTO containing details.
 * @returns {UseMutationResult<Role, Error, { id: number; dto: ReplaceRoleDTO }>} The mutation result.
 */
export function useReplaceRole() {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, { id: number; dto: ReplaceRoleDTO }>({
    mutationFn: async ({ id, dto }) => {
      const response = await apiClient.put<ApiResponse<Role>>(
        `${PATH}/${id}`,
        dto,
      );
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles", id] });
    },
  });
}

/**
 * Update a role by ID.
 * @param {number} id ID.
 * @param {UpdateRoleDTO} dto DTO containing details.
 * @returns {UseMutationResult<Role, Error, { id: number; dto: UpdateRoleDTO }>} The mutation result.
 */
export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, { id: number; dto: UpdateRoleDTO }>({
    mutationFn: async ({ id, dto }) => {
      const response = await apiClient.patch<ApiResponse<Role>>(
        `${PATH}/${id}`,
        dto,
      );
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles", id] });
    },
  });
}

/**
 * Delete a role by ID.
 * @param {number} dto DTO containing details.
 * @returns {UseMutationResult<Role, Error, number>} The mutation result.
 */
export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, number>({
    mutationFn: async (id) => {
      const response = await apiClient.delete<ApiResponse<Role>>(
        `${PATH}/${id}`,
      );
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles", id] });
    },
  });
}

/**
 * Get the permissions for a role by ID.
 * @param {number} id id parameter.
 * @returns {UseQueryResult<Role>} The query result.
 */
export function useRolePermissions(id: number) {
  return useQuery<Role>({
    queryKey: ["roles", id, "permissions"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Role>>(
        `${PATH}/${id}/permissions`,
      );
      return response.data.data;
    },
    enabled: !!id,
  });
}

/**
 * Add permissions to a role.
 *
 * @param {number} id ID.
 * @param {AddRolePermissionsDTO} dto DTO containing details.
 * @returns {UseMutationResult<Role, Error, { id: number; dto: AddRolePermissionsDTO }>} The mutation result.
 */
export function useAddRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, { id: number; dto: AddRolePermissionsDTO }>({
    mutationFn: async ({ id, dto }) => {
      const response = await apiClient.post<ApiResponse<Role>>(
        `${PATH}/${id}/permissions`,
        dto,
      );
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["roles", id, "permissions"] });
    },
  });
}
