import { usePage } from '@inertiajs/react';

/**
 * Reads the auth data shared by HandleInertiaRequests.
 * can('edit products') and hasRole('Admin') drive conditional rendering.
 * The server still checks every request; this only hides what a user cannot use.
 */
export default function useAuth() {
    const { auth } = usePage().props;
    const roles = auth?.roles ?? [];
    const permissions = auth?.permissions ?? [];

    return {
        user: auth?.user ?? null,
        roles,
        permissions,
        can: (permission) => permissions.includes(permission),
        hasRole: (role) => roles.includes(role),
    };
}
