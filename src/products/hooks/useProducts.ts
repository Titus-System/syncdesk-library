import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api";
import type { ApiResponse, PaginatedRequest } from "../../api/typings";
import type {
  Product,
  CreateProductDTO,
  ReplaceProductDTO,
  UpdateProductDTO,
  AddProductToCompaniesDTO,
  RemoveProductFromCompaniesDTO,
} from "../types/product";
import type { Company } from "../../companies/types/company";

const PATH = "/products";

/**
 * List all products.
 * @param {PaginatedRequest} params Pagination params
 * @returns {UseQueryResult<Product[]>} The query result.
 */
export function useProducts(pagination: PaginatedRequest = {}) {
  return useQuery<Product[]>({
    queryKey: ["products", pagination],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Product[]>>(`${PATH}/`, {
        params: pagination,
      });
      return response.data.data;
    },
  });
}

/**
 * Get a product by ID.
 * @param {number} id id parameter.
 * @returns {UseQueryResult<Product>} The query result.
 */
export function useProduct(id: number) {
  return useQuery<Product>({
    queryKey: ["products", id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Product>>(
        `${PATH}/${id}`,
      );
      return response.data.data;
    },
    enabled: !!id,
  });
}

/**
 * Create a new product.
 * @returns {UseMutationResult<Product, Error, CreateProductDTO>} The mutation result.
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, CreateProductDTO>({
    mutationFn: async (dto) => {
      const response = await apiClient.post<ApiResponse<Product>>(
        `${PATH}/`,
        dto,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

/**
 * Replace a product by ID.
 * @returns {UseMutationResult<Product, Error, { id: number; dto: ReplaceProductDTO }>} The mutation result.
 */
export function useReplaceProduct() {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, { id: number; dto: ReplaceProductDTO }>({
    mutationFn: async ({ id, dto }) => {
      const response = await apiClient.put<ApiResponse<Product>>(
        `${PATH}/${id}`,
        dto,
      );
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
  });
}

/**
 * Update a product by ID.
 * @returns {UseMutationResult<Product, Error, { id: number; dto: UpdateProductDTO }>} The mutation result.
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, { id: number; dto: UpdateProductDTO }>({
    mutationFn: async ({ id, dto }) => {
      const response = await apiClient.patch<ApiResponse<Product>>(
        `${PATH}/${id}`,
        dto,
      );
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
  });
}

/**
 * Perform a soft delete on a product by ID.
 * @returns {UseMutationResult<Product, Error, number>} The mutation result.
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, number>({
    mutationFn: async (id) => {
      const response = await apiClient.delete<ApiResponse<Product>>(
        `${PATH}/${id}`,
      );
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
  });
}

// Companies
/**
 * Get companies that have a specific product.
 * @param {number} productId The product ID.
 * @param {PaginatedRequest} params Pagination params
 * @returns {UseQueryResult<Company[]>} The query result.
 */
export function useProductCompanies(
  productId: number,
  pagination: PaginatedRequest = {},
) {
  return useQuery<Company[]>({
    queryKey: ["products", productId, "companies", pagination],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Company[]>>(
        `${PATH}/${productId}/companies`,
        {
          params: pagination,
        },
      );
      return response.data.data;
    },
    enabled: !!productId,
  });
}

/**
 * Add a product to multiple companies.
 * @returns {UseMutationResult<void, Error, { productId: number; dto: AddProductToCompaniesDTO }>}
 */
export function useAddProductToCompanies() {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { productId: number; dto: AddProductToCompaniesDTO }
  >({
    mutationFn: async ({ productId, dto }) => {
      await apiClient.post(`${PATH}/${productId}/companies`, dto);
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: ["products", productId, "companies"],
      });
    },
  });
}

/**
 * Remove a product from multiple companies in batch.
 * @returns {UseMutationResult<void, Error, { productId: number; dto: RemoveProductFromCompaniesDTO }>}
 */
export function useRemoveProductFromCompaniesBatch() {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { productId: number; dto: RemoveProductFromCompaniesDTO }
  >({
    mutationFn: async ({ productId, dto }) => {
      await apiClient.delete(`${PATH}/${productId}/companies`, { data: dto });
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: ["products", productId, "companies"],
      });
    },
  });
}

/**
 * Remove a product from a specific company.
 * @returns {UseMutationResult<void, Error, { productId: number; companyId: string }>}
 */
export function useRemoveProductCompany() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { productId: number; companyId: string }>({
    mutationFn: async ({ productId, companyId }) => {
      await apiClient.delete(`${PATH}/${productId}/companies/${companyId}`);
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: ["products", productId, "companies"],
      });
    },
  });
}
