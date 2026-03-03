import type { UserRole } from '@/shared/types';

/** Route paths — single source of truth for navigation */
export const ROUTES = {
    LOGIN: '/login',

    // Admin routes
    ADMIN_DASHBOARD: '/admin',
    ADMIN_SERVICE_REQUESTS: '/admin/service-requests',
    ADMIN_USERS: '/admin/users',
    ADMIN_ALERTS: '/admin/alerts',

    // Agent routes
    AGENT_DASHBOARD: '/agent',
    AGENT_REQUESTS: '/agent/requests',
} as const;

/** Maps a role to its default landing route after login */
export function getDashboardRoute(role: UserRole): string {
    switch (role) {
        case 'ADMIN':
            return ROUTES.ADMIN_DASHBOARD;
        case 'AGENT':
            return ROUTES.AGENT_DASHBOARD;
        default:
            // ELDERLY and FAMILY use the mobile app — shouldn't reach here
            return ROUTES.LOGIN;
    }
}
