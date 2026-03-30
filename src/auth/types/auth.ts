export type OAuthProvider = "local" | "google" | "microsoft";

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
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
  username: string;
  password: string;
}

// I am making a safe assumption for your /me route based on "user_with_roles"
export interface UserWithRoles {
  id: string;
  email: string;
  username: string;
  roles: string[];
}
