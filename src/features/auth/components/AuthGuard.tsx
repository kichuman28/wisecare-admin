import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../use-auth';
import { ROUTES } from '@/shared/constants';

/**
 * Route guard — renders child routes only if authenticated.
 * While the session is being restored (initial load), shows a loading state.
 * If not authenticated, redirects to the login page.
 */
export function AuthGuard() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-gray-500">Loading…</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <Outlet />;
}
