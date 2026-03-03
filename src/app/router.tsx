import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { LoginPage, AuthGuard, RoleGuard } from '@/features/auth';
import { AdminLayout } from '@/app/layouts/AdminLayout';
import { AgentLayout } from '@/app/layouts/AgentLayout';
import { RoleRedirect } from '@/app/routes/RoleRedirect';
import {
    AdminDashboardPage,
    AdminServiceRequestsPage,
    AdminUsersPage,
    AdminAlertsPage,
} from '@/app/routes/admin.pages';
import { AgentDashboardPage } from '@/app/routes/agent.pages';

// ---------------------------------------------------------------------------
// Not Found
// ---------------------------------------------------------------------------

function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-2">
            <h1 className="text-4xl font-bold text-gray-800">404</h1>
            <p className="text-gray-500">Page not found</p>
        </div>
    );
}

// ---------------------------------------------------------------------------
// App routes
// ---------------------------------------------------------------------------

export function AppRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />

            {/* Root redirect — sends to role-specific dashboard */}
            <Route path="/" element={<RoleRedirect />} />

            {/* Protected: Auth required */}
            <Route element={<AuthGuard />}>

                {/* Admin routes — ADMIN role only */}
                <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
                    <Route element={<AdminLayout />}>
                        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
                        <Route path={ROUTES.ADMIN_SERVICE_REQUESTS} element={<AdminServiceRequestsPage />} />
                        <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
                        <Route path={ROUTES.ADMIN_ALERTS} element={<AdminAlertsPage />} />
                    </Route>
                </Route>

                {/* Agent routes — AGENT role only */}
                <Route element={<RoleGuard allowedRoles={['AGENT']} />}>
                    <Route element={<AgentLayout />}>
                        <Route path={ROUTES.AGENT_DASHBOARD} element={<AgentDashboardPage />} />
                        <Route path={ROUTES.AGENT_REQUESTS} element={<AgentDashboardPage />} />
                    </Route>
                </Route>

            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
