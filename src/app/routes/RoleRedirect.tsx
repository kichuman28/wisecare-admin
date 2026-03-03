import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { getDashboardRoute, ROUTES } from '@/shared/constants';

/**
 * Root "/" redirect — sends authenticated users to their role-specific
 * dashboard, or to login if not authenticated.
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

    return <Navigate to={getDashboardRoute(user.role)} replace />;
}
