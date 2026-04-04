import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api";
import type { ApiResponse } from "../../api";
import type {
  Permission,
  CreatePermissionDTO,
  ReplacePermissionDTO,
  UpdatePermissionDTO,
  AddPermissionRolesDTO,
} from "../types/permission";

const PATH = "/permissions";

/**
 * List all permissions.
 * @returns {UseQueryResult<Permission[]>} The query result.
 */
export function usePermissions() {
  return useQuery<Permission[]>({
    queryKey: ["permissions"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Permission[]>>(
        `${PATH}/`,
      );
      return response.data.data;
    },
  });
}

/**
 * Get a permission by ID.
 * @param {number} id id parameter.
 * @returns {UseQueryResult<Permission>} The query result.
 */
export function usePermission(id: number) {
  return useQuery<Permission>({
    queryKey: ["permissions", id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Permission>>(
        `${PATH}/${id}`,
      );
      return response.data.data;
    },
    enabled: !!id,
  });
}

/**
 * Create a new permission.
 * @param {CreatePermissionDTO} dto DTO containing details.
 * @returns {UseMutationResult<Permission, Error, CreatePermissionDTO>} The mutation result.
 */
export function useCreatePermission() {
  const queryClient = useQueryClient();
  return useMutation<Permission, Error, CreatePermissionDTO>({
    mutationFn: async (dto) => {
      const response = await apiClient.post<ApiResponse<Permission>>(
        `${PATH}/`,
        dto,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
}

/**
 * Replace a permission by ID.
 * @param {number} id ID.
 * @param {ReplacePermissionDTO} dto DTO containing details.
 * @returns {UseMutationResult<Permission,
    Error,
    { id: number; dto: ReplacePermissionDTO }>} The mutation result.
 */
export function useReplacePermission() {
  const queryClient = useQueryClient();
  return useMutation<
    Permission,
    Error,
    { id: number; dto: ReplacePermissionDTO }
  >({
    mutationFn: async ({ id, dto }) => {
      const response = await apiClient.put<ApiResponse<Permission>>(
        `${PATH}/${id}`,
        dto,
      );
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({ queryKey: ["permissions", id] });
    },
  });
}

/**
 * Update a permission by ID.
 * @param {number} id ID.
 * @param {UpdatePermissionDTO} dto DTO containing details.
 * @returns {UseMutationResult<Permission,
    Error,
    { id: number; dto: UpdatePermissionDTO }>} The mutation result.
 */
export function useUpdatePermission() {
  const queryClient = useQueryClient();
  return useMutation<
    Permission,
    Error,
    { id: number; dto: UpdatePermissionDTO }
  >({
    mutationFn: async ({ id, dto }) => {
      const response = await apiClient.patch<ApiResponse<Permission>>(
        `${PATH}/${id}`,
        dto,
      );
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({ queryKey: ["permissions", id] });
    },
  });
}

/**
 * Delete a permission by ID.
 * @param {number} dto DTO containing details.
 * @returns {UseMutationResult<Permission, Error, number>} The mutation result.
 */
export function useDeletePermission() {
  const queryClient = useQueryClient();
  return useMutation<Permission, Error, number>({
    mutationFn: async (id) => {
      const response = await apiClient.delete<ApiResponse<Permission>>(
        `${PATH}/${id}`,
      );
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({ queryKey: ["permissions", id] });
    },
  });
}

/**
 * Get permission with associated roles.
 *
 * All roles that have this permission will be included in the
 * response under a `roles` field.
 *
 * @param {number} id id parameter.
 * @returns {UseQueryResult<Permission>} The query result.
 */
export function usePermissionRoles(id: number) {
  return useQuery<Permission>({
    queryKey: ["permissions", id, "roles"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Permission>>(
        `${PATH}/${id}/roles`,
      );
      return response.data.data;
    },
    enabled: !!id,
  });
}

/**
 * Add a permission to a list of roles.
 * @param {number} id ID.
 * @param {AddPermissionRolesDTO} dto DTO containing details.
 * @returns {UseMutationResult<Permission,
    Error,
    { id: number; dto: AddPermissionRolesDTO }>} The mutation result.
 */
export function useAddPermissionRoles() {
  const queryClient = useQueryClient();
  return useMutation<
    Permission,
    Error,
    { id: number; dto: AddPermissionRolesDTO }
  >({
    mutationFn: async ({ id, dto }) => {
      const response = await apiClient.post<ApiResponse<Permission>>(
        `${PATH}/${id}/roles`,
        dto,
      );
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["permissions", id, "roles"] });
    },
  });
}
