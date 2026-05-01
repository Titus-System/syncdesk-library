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
 * @returns {UseQueryResult<UserWithRoles, Error>} The query result.
 * GET /api/auth/me
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
 * @param {UserLoginRequest} credentials The user login credentials.
 * @returns {UseMutationResult<LoginResponse, Error, UserLoginRequest>} The mutation result.
 * POST /api/auth/login
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
 * @param {RegisterUserRequest} userData The user registration details.
 * @returns {UseMutationResult<UserCreatedResponse, Error, RegisterUserRequest>} The mutation result.
 * POST /api/auth/register
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
 * @returns {UseMutationResult<void, Error, void>} The mutation result.
 * POST /api/auth/logout
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
 * @param {AdminRegisterUserRequest} userData The admin user registration details.
 * @returns {UseMutationResult<User, Error, AdminRegisterUserRequest>} The mutation result.
 * POST /api/auth/admin/register
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
 * Change the current user's password.
 * @param {ChangePasswordRequest} data The password change request details.
 * @returns {UseMutationResult<void, Error, ChangePasswordRequest>} The mutation result.
 * POST /api/auth/change-password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest): Promise<void> => {
      await apiClient.post(`${PATH}/change-password`, data);
    },
  });
};

/**
 * Request a password reset.
 * @param {ForgotPasswordRequest} data The forgot password request details.
 * @returns {UseMutationResult<ForgotPasswordResponse, Error, ForgotPasswordRequest>} The mutation result.
 * POST /api/auth/forgot-password
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
 * Reset the current user's password using a valid reset token.
 * @param {ResetPasswordRequest} data The reset password request details.
 * @returns {UseMutationResult<void, Error, ResetPasswordRequest>} The mutation result.
 * POST /api/auth/reset-password
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest): Promise<void> => {
      await apiClient.post(`${PATH}/reset-password`, data);
    },
  });
};
