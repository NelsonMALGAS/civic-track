"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { roles, type RoleName } from "@/lib/permissions";

export async function getUserPermissions() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null; // User is not logged in
  }

  // Better Auth stores single roles as "admin" or multiple roles as "editor,moderator"
  const rawRole = session.user.role || "user";
  const assignedRoles = rawRole
    .split(",")
    .map((r) => r.trim())
    .filter((r): r is RoleName => r in roles);

  // Merge permission statements across all roles assigned to the user
  const mergedPermissions: Record<string, string[]> = {};

  for (const roleName of assignedRoles) {
    const roleStatements = roles[roleName].statements;

    for (const [resource, actions] of Object.entries(roleStatements)) {
      const existing = mergedPermissions[resource] ?? [];
      mergedPermissions[resource] = Array.from(
        new Set([...existing, ...(actions as readonly string[])]),
      );
    }
  }

  return {
    userId: session.user.id,
    roles: assignedRoles,
    permissions: mergedPermissions,
  };
}
