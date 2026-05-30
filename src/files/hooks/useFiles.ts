import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api";
import type { ApiResponse } from "../../api";
import type {
  PresignUploadRequest,
  PresignUploadResponse,
  ConfirmUploadResponse,
  DownloadUrlResponse,
} from "../types/files";

const PATH = "/files";

/**
 * Initiate the presign upload process and return the MinIO policy/URL.
 * @returns {UseMutationResult<PresignUploadResponse, Error, PresignUploadRequest>} The mutation result.
 * POST /api/files/presign-upload
 */
export const usePresignUpload = () => {
  return useMutation({
    mutationFn: async (
      data: PresignUploadRequest,
    ): Promise<PresignUploadResponse> => {
      const response = await apiClient.post<ApiResponse<PresignUploadResponse>>(
        `${PATH}/presign-upload`,
        data,
      );
      return response.data.data as PresignUploadResponse;
    },
  });
};

/**
 * Confirm with the backend that the file has finished uploading to MinIO.
 * @returns {UseMutationResult<ConfirmUploadResponse, Error, string>} The mutation result.
 * POST /api/files/{file_id}/confirm
 */
export const useConfirmUpload = () => {
  return useMutation({
    mutationFn: async (fileId: string): Promise<ConfirmUploadResponse> => {
      const response = await apiClient.post<ApiResponse<ConfirmUploadResponse>>(
        `${PATH}/${fileId}/confirm`,
      );
      return response.data.data as ConfirmUploadResponse;
    },
  });
};

/**
 * Retrieve a temporary URL to download the file directly from MinIO.
 * @param {string | null | undefined} fileId The file ID parameter.
 * @param {boolean} enabled Optional flag to enable or disable the query.
 * @returns {UseQueryResult<DownloadUrlResponse>} The query result.
 * GET /api/files/{file_id}/download-url
 */
export const useGetDownloadUrl = (
  fileId: string | null | undefined,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["files", fileId, "download-url"],
    queryFn: async (): Promise<DownloadUrlResponse> => {
      const response = await apiClient.get<ApiResponse<DownloadUrlResponse>>(
        `${PATH}/${fileId}/download-url`,
      );
      return response.data.data as DownloadUrlResponse;
    },
    enabled: !!fileId && enabled,
    // Cache the URL for 4 minutes to prevent duplicate API calls (since it expires in 5 mins)
    staleTime: 4 * 60 * 1000,
  });
};

/**
 * Delete a file by ID.
 * @returns {UseMutationResult<void, Error, string>} The mutation result.
 * DELETE /api/files/{file_id}
 */
export const useDeleteFile = () => {
  return useMutation({
    mutationFn: async (fileId: string): Promise<void> => {
      await apiClient.delete(`${PATH}/${fileId}`);
    },
  });
};
