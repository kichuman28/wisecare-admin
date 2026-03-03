import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/shared/constants';
import type { UserRole } from '@/shared/types';

interface RoleGuardProps {
    /** Roles allowed to access child routes */
    allowedRoles: UserRole[];
}

/**
 * Route guard — renders child routes only if the authenticated user
 * has one of the allowed roles. Redirects to the user's own dashboard
 * if their role doesn't match (prevents AGENT accessing admin pages).
 *
 * Must be nested inside AuthGuard (assumes user is authenticated).
 */
export function RoleGuard({ allowedRoles }: RoleGuardProps) {
    const { user } = useAuth();

    if (!user || !allowedRoles.includes(user.role)) {
        // User is authenticated but wrong role — send to login
        // (AuthGuard will redirect them to their own dashboard on next navigation)
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <Outlet />;
}
