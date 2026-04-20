import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api";
import type { ApiResponse } from "../../api";
import type {
  Company,
  CreateCompanyDTO,
  ReplaceCompanyDTO,
  UpdateCompanyDTO,
  AddCompanyProductDTO,
  RemoveCompanyProductDTO,
  AddCompanyUsersDTO,
  RemoveCompanyUsersDTO,
} from "../types/company";
import type { User } from "../../users/types/user";
import { PaginatedRequest } from "../../api/typings";

const PATH = "/companies";

/**
 * List all companies.
 * @param {PaginatedRequest} params Pagination params
 * @returns {UseQueryResult<Company[]>} The query result.
 */
export function useCompanies(pagination: PaginatedRequest = {}) {
  return useQuery<Company[]>({
    queryKey: ["companies", pagination],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Company[]>>(`${PATH}/`, {
        params: pagination,
      });
      return response.data.data;
    },
  });
}

/**
 * Get a company by ID.
 * @param {string} id id parameter.
 * @returns {UseQueryResult<Company>} The query result.
 */
export function useCompany(id: string) {
  return useQuery<Company>({
    queryKey: ["companies", id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Company>>(
        `${PATH}/${id}`,
      );
      return response.data.data;
    },
    enabled: !!id,
  });
}

/**
 * Create a new company.
 * @returns {UseMutationResult<Company, Error, CreateCompanyDTO>} The mutation result.
 */
export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation<Company, Error, CreateCompanyDTO>({
    mutationFn: async (dto) => {
      const response = await apiClient.post<ApiResponse<Company>>(
        `${PATH}/`,
        dto,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

/**
 * Replace a company by ID.
 * @returns {UseMutationResult<Company, Error, { id: string; dto: ReplaceCompanyDTO }>} The mutation result.
 */
export function useReplaceCompany() {
  const queryClient = useQueryClient();
  return useMutation<Company, Error, { id: string; dto: ReplaceCompanyDTO }>({
    mutationFn: async ({ id, dto }) => {
      const response = await apiClient.put<ApiResponse<Company>>(
        `${PATH}/${id}`,
        dto,
      );
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["companies", id] });
    },
  });
}

/**
 * Update a company by ID.
 * @returns {UseMutationResult<Company, Error, { id: string; dto: UpdateCompanyDTO }>} The mutation result.
 */
export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation<Company, Error, { id: string; dto: UpdateCompanyDTO }>({
    mutationFn: async ({ id, dto }) => {
      const response = await apiClient.patch<ApiResponse<Company>>(
        `${PATH}/${id}`,
        dto,
      );
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["companies", id] });
    },
  });
}

/**
 * Perform a soft delete on a company by ID.
 * @returns {UseMutationResult<Company, Error, string>} The mutation result.
 */
export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation<Company, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.delete<ApiResponse<Company>>(
        `${PATH}/${id}`,
      );
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["companies", id] });
    },
  });
}

// Products
/**
 * Add products to a company.
 * @returns {UseMutationResult<void, Error, { companyId: string; dto: AddCompanyProductDTO }>}
 */
export function useAddCompanyProducts() {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { companyId: string; dto: AddCompanyProductDTO }
  >({
    mutationFn: async ({ companyId, dto }) => {
      await apiClient.post(`${PATH}/${companyId}/products`, dto);
    },
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({
        queryKey: ["companies", companyId, "products"],
      });
      queryClient.invalidateQueries({ queryKey: ["companies", companyId] });
    },
  });
}

/**
 * Remove multiple products from a company.
 * @returns {UseMutationResult<void, Error, { companyId: string; dto: RemoveCompanyProductDTO }>}
 */
export function useDeleteCompanyProductsBatch() {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { companyId: string; dto: RemoveCompanyProductDTO }
  >({
    mutationFn: async ({ companyId, dto }) => {
      await apiClient.delete(`${PATH}/${companyId}/products`, { data: dto });
    },
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({
        queryKey: ["companies", companyId, "products"],
      });
      queryClient.invalidateQueries({ queryKey: ["companies", companyId] });
    },
  });
}

/**
 * Remove a specific product from a company.
 * @returns {UseMutationResult<void, Error, { companyId: string; productId: number }>}
 */
export function useDeleteCompanyProduct() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { companyId: string; productId: number }>({
    mutationFn: async ({ companyId, productId }) => {
      await apiClient.delete(`${PATH}/${companyId}/products/${productId}`);
    },
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({
        queryKey: ["companies", companyId, "products"],
      });
      queryClient.invalidateQueries({ queryKey: ["companies", companyId] });
    },
  });
}

// Users
/**
 * Get users of a company.
 * @param {string} companyId The company ID.
 * @param {PaginatedRequest} params Pagination params
 * @returns {UseQueryResult<User[]>} The query result.
 */
export function useCompanyUsers(
  companyId: string,
  pagination: PaginatedRequest = {},
) {
  return useQuery<User[]>({
    queryKey: ["companies", companyId, "users", pagination],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<User[]>>(
        `${PATH}/${companyId}/users`,
        {
          params: pagination,
        },
      );
      return response.data.data;
    },
    enabled: !!companyId,
  });
}

/**
 * Add users to a company.
 * @returns {UseMutationResult<void, Error, { companyId: string; dto: AddCompanyUsersDTO }>}
 */
export function useAddCompanyUsers() {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { companyId: string; dto: AddCompanyUsersDTO }
  >({
    mutationFn: async ({ companyId, dto }) => {
      await apiClient.post(`${PATH}/${companyId}/users`, dto);
    },
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({
        queryKey: ["companies", companyId, "users"],
      });
    },
  });
}

/**
 * Remove multiple users from a company.
 * @returns {UseMutationResult<void, Error, { companyId: string; dto: RemoveCompanyUsersDTO }>}
 */
export function useDeleteCompanyUsersBatch() {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { companyId: string; dto: RemoveCompanyUsersDTO }
  >({
    mutationFn: async ({ companyId, dto }) => {
      await apiClient.delete(`${PATH}/${companyId}/users`, { data: dto });
    },
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({
        queryKey: ["companies", companyId, "users"],
      });
    },
  });
}

/**
 * Remove a specific user from a company.
 * @returns {UseMutationResult<void, Error, { companyId: string; userId: string }>}
 */
export function useDeleteCompanyUser() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { companyId: string; userId: string }>({
    mutationFn: async ({ companyId, userId }) => {
      await apiClient.delete(`${PATH}/${companyId}/users/${userId}`);
    },
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({
        queryKey: ["companies", companyId, "users"],
      });
    },
  });
}
