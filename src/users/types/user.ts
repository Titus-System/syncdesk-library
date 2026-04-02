import { OAuthProvider } from "../../auth/types/auth";

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

import type { Role } from "../../roles/types/role";
import type { Permission } from "../../permissions/types/permission";

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
