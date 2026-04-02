export {
  useGetUsers,
  useGetUser,
  useCreateUser,
  useUpdateUser,
  usePatchUser,
  useAddUserRoles,
} from "./hooks/useUsers";

export type {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  ReplaceUserDTO,
  AddUserRolesDTO,
} from "./types/user";

// # syncdesk-api/app/api/api_router
// - /auth/ -- /app/domains/auth/routers/auth_router
// | `/api/users/`             | User management (CRUD)       |
// | `/api/roles/`             | Role management (CRUD)       |
// | `/api/permissions/`       | Permission management (CRUD) |
