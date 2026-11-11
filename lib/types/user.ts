/** Platform roles — keep in sync with lib/auth.ts `user.additionalFields.role`. */
export type UserRole = "seeker" | "recruiter" | "admin"

export const USER_ROLES: UserRole[] = ["seeker", "recruiter", "admin"]

export function isUserRole(value: unknown): value is UserRole {
    return typeof value === "string" && (USER_ROLES as string[]).includes(value)
}

/** Display label per role (used in the sidebar identity card and dashboard headers). */
export const ROLE_LABEL: Record<UserRole, string> = {
    seeker: "Seeker",
    recruiter: "Recruiter",
    admin: "Admin",
}

/**
 * Extract the role from a better-auth session user.
 * `role` is a user additional field, so it arrives as an unknown string on the client.
 */
export function getUserRole(user: unknown): UserRole {
    const role = (user as { role?: unknown } | null | undefined)?.role
    return isUserRole(role) ? role : "seeker"
}
