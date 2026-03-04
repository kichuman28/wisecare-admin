import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { getOnboardingRoute, ROUTES } from '@/shared/constants';

/**
 * Onboarding guard for FAMILY users.
 * - If onboardingStep is COMPLETE → redirect to family dashboard
 * - Otherwise → render the onboarding Outlet (child routes)
 *
 * Must be nested inside AuthGuard.
 */
export function FamilyOnboardingGuard() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    // If onboarding is done, skip to dashboard
    if (user.onboardingStep === 'COMPLETE') {
        return <Navigate to={ROUTES.FAMILY_DASHBOARD} replace />;
    }

    return <Outlet />;
}

/**
 * Dashboard guard for FAMILY users.
 * - If onboardingStep is NOT COMPLETE → redirect to correct onboarding step
 * - Otherwise → render dashboard Outlet
 */
export function FamilyDashboardGuard() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (user.onboardingStep !== 'COMPLETE') {
        return <Navigate to={getOnboardingRoute(user.onboardingStep)} replace />;
    }

    return <Outlet />;
}
