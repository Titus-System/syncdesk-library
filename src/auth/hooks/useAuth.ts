import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiResponse } from "../../api";
import {
  AdminRegisterUserRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginResponse,
  RegisterUserRequest,
  ResetPasswordRequest,
  UserCreatedResponse,
  UserLoginRequest,
  UserWithRoles,
} from "../types/auth";
import { User } from "../../users/types/user";

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

/**
 * Register a new user as admin.
 */
export const useAdminRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: AdminRegisterUserRequest): Promise<User> => {
      const response = await apiClient.post<ApiResponse<User>>(
        `${PATH}/admin/register`,
        userData,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

/**
 * Change the password of the current user.
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest): Promise<void> => {
      await apiClient.post(`${PATH}/change-password`, data);
    },
  });
};

/**
 * Request a password reset email.
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (
      data: ForgotPasswordRequest,
    ): Promise<ForgotPasswordResponse> => {
      const response = await apiClient.post<
        ApiResponse<ForgotPasswordResponse>
      >(`${PATH}/forgot-password`, data);
      return response.data.data;
    },
  });
};

/**
 * Reset a user's password using a valid reset token.
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest): Promise<void> => {
      await apiClient.post(`${PATH}/reset-password`, data);
    },
  });
};
