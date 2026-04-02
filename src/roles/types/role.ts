export interface Role {
  id: number;
  name: string;
  description?: string | null;
  permissions?: Permission[];
}

export interface CreateRoleDTO {
  name: string;
  description?: string | null;
}

export interface ReplaceRoleDTO {
  name: string;
  description?: string | null;
}

export interface UpdateRoleDTO {
  name?: string | null;
  description?: string | null;
}

export interface AddRolePermissionsDTO {
  ids: number[];
}

// Importing Permission here to avoid circular dependency issues, or we can just redefine it as any or import it.
import type { Permission } from "../../permissions/types/permission";
