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

export function useRoles() {
  return useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Role[]>>(`${PATH}/`);
      return response.data.data;
    },
  });
}

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
