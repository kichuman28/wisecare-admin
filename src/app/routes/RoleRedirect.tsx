import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { getDashboardRoute, getOnboardingRoute, ROUTES } from '@/shared/constants';

/**
 * Root "/" redirect — sends authenticated users to their role-specific
 * dashboard, or to login if not authenticated.
 * FAMILY users mid-onboarding are routed to the correct step.
 */
export function RoleRedirect() {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-gray-500">Loading…</p>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    // FAMILY mid-onboarding → resume onboarding
    if (user.role === 'FAMILY' && user.onboardingStep !== 'COMPLETE') {
        return <Navigate to={getOnboardingRoute(user.onboardingStep)} replace />;
    }

    return <Navigate to={getDashboardRoute(user.role)} replace />;
}

