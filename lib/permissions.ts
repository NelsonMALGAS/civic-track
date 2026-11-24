import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

// 1. Define all resources and their allowed actions
const statement = {
  ...defaultStatements,
  project: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

// 2. Define as many roles as you need
export const user = ac.newRole({
  project: ["read"],
});

export const municipality = ac.newRole({
  project: ["create", "read", "update"],
});

export const moderator = ac.newRole({
  project: ["read", "delete"],
  user: ["list", "ban"], // Built-in user actions from defaultStatements
});

export const admin = ac.newRole({
  ...adminAc.statements, // Grants all default admin permissions
  project: ["create", "read", "update", "delete"],
});

export const roles = {
  user,
  municipality,
  moderator,
  admin,
};

export type RoleName = keyof typeof roles;
