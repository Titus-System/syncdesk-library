export type OAuthProvider = "local" | "google" | "microsoft";

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  must_change_password?: boolean;
  must_accept_terms?: boolean;
}

export interface UserCreatedResponse {
  id: string;
  email: string;
  username: string;
  access_token: string;
  refresh_token: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface RegisterUserRequest {
  email: string;
  name?: string;
  username?: string;
  password: string;
}

export interface AdminRegisterUserRequest {
  email: string;
  name?: string | null;
  role_ids?: number[];
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

// I am making a safe assumption for your /me route based on "user_with_roles"
export interface UserWithRoles {
  id: string;
  email: string;
  username: string;
  name?: string | null;
  roles: string[];
}
