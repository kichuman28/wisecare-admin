import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { LoginPage, AuthGuard } from '@/features/auth';

// ---------------------------------------------------------------------------
// Placeholder pages — replace with feature modules as they are built
// ---------------------------------------------------------------------------

function DashboardPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <h1 className="text-2xl font-semibold text-gray-800">
                WiseCare Admin — Dashboard
            </h1>
        </div>
    );
}

function ServiceRequestsPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <h1 className="text-2xl font-semibold text-gray-800">
                WiseCare Admin — Service Requests
            </h1>
        </div>
    );
}

function UsersPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <h1 className="text-2xl font-semibold text-gray-800">
                WiseCare Admin — Users
            </h1>
        </div>
    );
}

function AlertsPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <h1 className="text-2xl font-semibold text-gray-800">
                WiseCare Admin — Alerts
            </h1>
        </div>
    );
}

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

            {/* Protected routes — requires authentication */}
            <Route element={<AuthGuard />}>
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                <Route path={ROUTES.SERVICE_REQUESTS} element={<ServiceRequestsPage />} />
                <Route path={ROUTES.USERS} element={<UsersPage />} />
                <Route path={ROUTES.ALERTS} element={<AlertsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
