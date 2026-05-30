import { OAuthProvider } from "../../auth/types/auth";
import type { Role } from "../../roles/types/role";

export interface User {
  id: string;
  email: string;
  username?: string | null;
  name?: string | null;
  oauth_provider?: OAuthProvider | null;
  oauth_provider_id?: string | null;
  is_active: boolean;
  is_verified: boolean;
  roles?: Role[];
}

export interface CreateUserDTO {
  email: string;
  password_hash?: string | null;
  username?: string | null;
  name?: string | null;
  oauth_provider?: OAuthProvider | null;
  oauth_provider_id?: string | null;
  is_active?: boolean;
  is_verified?: boolean;
  role_ids?: number[];
}

export type UpdateUserDTO = Partial<Omit<CreateUserDTO, "role_ids">>;

export type ReplaceUserDTO = CreateUserDTO;

export interface AddUserRolesDTO {
  role_ids: number[];
}

export interface RemoveUserRolesDTO {
  role_ids: number[];
}

export interface UpdateUserRolesDTO {
  add_role_ids?: number[];
  remove_role_ids?: number[];
}

export interface CurrentUserAvatarDTO {
  file_id: string | null;
  download_url: string | null;
  expires_at: string | null;
}

export interface LevelResponse {
  id: number;
  name: string;
}

export interface UserLevelResponse {
  user_id: string;
  level: LevelResponse;
  created_at: string;
}

export interface UserLevelsResponse {
  user_id: string;
  levels: LevelResponse[];
}

export interface LevelUserResponse {
  id: string;
  name?: string | null;
  email: string;
  username?: string | null;
}

export interface LevelUsersResponse {
  level: LevelResponse;
  users: LevelUserResponse[];
}

export interface DeleteUserLevelResponse {
  user_id: string;
  level_id: number;
  deleted: boolean;
}
