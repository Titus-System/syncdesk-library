import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiResponse } from "../../api";
import {
  LoginResponse,
  RegisterUserRequest,
  UserCreatedResponse,
  UserLoginRequest,
  UserWithRoles,
} from "../types/auth";

const PATH = "auth";

/**
 * Get the currently authenticated user's profile.
 */
export const useGetMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<UserWithRoles> => {
      const response = await apiClient.get<ApiResponse<UserWithRoles>>(
        `${PATH}/me`,
      );

      return response.data.data;
    },
    // if the user isn't logged in (401)
    retry: false,
  });
};

/**
 * Log in a user.
 *
 * Refresh tokens are handled automatically using Interceptors.
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      credentials: UserLoginRequest,
    ): Promise<LoginResponse> => {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        `${PATH}/login`,
        credentials,
      );
      return response.data.data;
    },
    onSuccess: () => {
      // After a successful login, fetch the new user's profile
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

/**
 * Register a new user.
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      userData: RegisterUserRequest,
    ): Promise<UserCreatedResponse> => {
      const response = await apiClient.post<ApiResponse<UserCreatedResponse>>(
        `${PATH}/register`,
        userData,
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Registration also logs them in (returns tokens), so fetch their profile
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

/**
 * Log out the current user.
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.post(`${PATH}/logout`);
    },
    onSuccess: () => {
      // clear cache
      queryClient.setQueryData(["me"], null);
      queryClient.clear();
    },
  });
};
