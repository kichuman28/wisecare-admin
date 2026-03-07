import type { OnboardingStep, UserRole } from '@/shared/types';

/** Route paths — single source of truth for navigation */
export const ROUTES = {
    LOGIN: '/login',
    FAMILY_SIGNUP: '/signup/family',

    // Admin routes
    ADMIN_DASHBOARD: '/admin',
    ADMIN_SERVICE_REQUESTS: '/admin/service-requests',
    ADMIN_USERS: '/admin/users',
    ADMIN_ALERTS: '/admin/alerts',
    ADMIN_ESCALATIONS: '/admin/escalations',
    ADMIN_AI_OPS: '/admin/ai-operations',
    ADMIN_RULES: '/admin/rules',
    ADMIN_AI_CONFIG: '/admin/ai-config',

    // Family routes
    FAMILY_ONBOARDING_BASIC: '/family/onboarding/basic',
    FAMILY_ONBOARDING_LINK: '/family/onboarding/link',
    FAMILY_DASHBOARD: '/family',
    FAMILY_TIMELINE: '/family/timeline',
    FAMILY_MEDICATIONS: '/family/medications',
    FAMILY_WALLET: '/family/wallet',
    FAMILY_SERVICE_REQUESTS: '/family/service-requests',
} as const;

/** Maps a role to its default landing route after login */
export function getDashboardRoute(role: UserRole): string {
    switch (role) {
        case 'ADMIN':
            return ROUTES.ADMIN_DASHBOARD;
        case 'FAMILY':
            return ROUTES.FAMILY_DASHBOARD;
        default:
            // ELDERLY uses the mobile app — shouldn't reach here
            return ROUTES.LOGIN;
    }
}

/**
 * Maps an onboarding step to the correct onboarding route.
 * Used after signup/signin to resume onboarding at the right point.
 */
export function getOnboardingRoute(step: OnboardingStep): string {
    switch (step) {
        case 'BASIC_INFO':
            return ROUTES.FAMILY_ONBOARDING_BASIC;
        case 'LINK':
            return ROUTES.FAMILY_ONBOARDING_LINK;
        case 'COMPLETE':
            return ROUTES.FAMILY_DASHBOARD;
        default:
            // MEDICATIONS, INVITE are elderly-only steps
            return ROUTES.FAMILY_ONBOARDING_BASIC;
    }
}
