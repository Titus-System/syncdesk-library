import type { Role } from "../../roles/types/role";

export interface Permission {
  id: number;
  name: string;
  description?: string | null;
  roles?: Role[];
}

export interface CreatePermissionDTO {
  name: string;
  description?: string | null;
}

export interface ReplacePermissionDTO {
  name: string;
  description?: string | null;
}

export interface UpdatePermissionDTO {
  name?: string | null;
  description?: string | null;
}

export interface AddPermissionRolesDTO {
  ids: number[];
}
