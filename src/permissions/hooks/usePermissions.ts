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
