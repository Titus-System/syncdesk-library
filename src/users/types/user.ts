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

export type UpdateUserDTO = Partial<CreateUserDTO>;

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
