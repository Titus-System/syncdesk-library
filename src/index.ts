// export * from "./auth";
// export * from "./api";
// export * from "./users";
// export { config } from "./config";
// export type { LibraryConfig } from "./config";

// ==========================================
// src/index.ts
// ==========================================

// 1. CONFIGURATION
export { config } from "./config"; // Export the value normally
export type { LibraryConfig } from "./config"; // Export the interface as a type

// 2. AUTHENTICATION
export { useGetMe, useLogin, useRegister, useLogout } from "./auth";
export type {
  OAuthProvider,
  LoginResponse,
  UserCreatedResponse,
  UserLoginRequest,
  RegisterUserRequest,
  UserWithRoles,
  Status,
  Session,
} from "./auth";

// 3. API
export { apiClient, configureLibrary } from "./api";
export type { ApiResponse } from "./api";

// 4. USERS
export {
  useGetUsers,
  useGetUser,
  useCreateUser,
  useUpdateUser,
  usePatchUser,
  useDeleteUser,
} from "./users";
export type { User, Permission, Role } from "./users";
