import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { LoginPage, AuthGuard, RoleGuard } from '@/features/auth';
import {
    FamilySignupPage,
    FamilyBasicOnboardingPage,
    FamilyLinkPage,
    FamilyOnboardingGuard,
    FamilyDashboardGuard,
} from '@/features/family';
import { AdminLayout } from '@/app/layouts/AdminLayout';
import { FamilyLayout } from '@/app/layouts/FamilyLayout';
import { RoleRedirect } from '@/app/routes/RoleRedirect';
import {
    AdminDashboardPage,
    AdminServiceRequestsPage,
    AdminUsersPage,
    AdminAlertsPage,
    AdminEscalationsPage,
    AdminAIOperationsPage,
    AdminRulesPage,
    AdminAIAgentConfigPage,
} from '@/app/routes/admin.pages';
import {
    FamilyDashboardPage,
    FamilyTimelinePage,
    FamilyMedicationsPage,
    FamilyWalletPage,
    FamilyServiceRequestsPage,
} from '@/app/routes/family.pages';

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
            <Route path={ROUTES.FAMILY_SIGNUP} element={<FamilySignupPage />} />

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
                        <Route path={ROUTES.ADMIN_ESCALATIONS} element={<AdminEscalationsPage />} />
                        <Route path={ROUTES.ADMIN_AI_OPS} element={<AdminAIOperationsPage />} />
                        <Route path={ROUTES.ADMIN_RULES} element={<AdminRulesPage />} />
                        <Route path={ROUTES.ADMIN_AI_CONFIG} element={<AdminAIAgentConfigPage />} />
                    </Route>
                </Route>


                {/* Family onboarding — FAMILY role, onboarding NOT complete */}
                <Route element={<RoleGuard allowedRoles={['FAMILY']} />}>
                    <Route element={<FamilyOnboardingGuard />}>
                        <Route path={ROUTES.FAMILY_ONBOARDING_BASIC} element={<FamilyBasicOnboardingPage />} />
                        <Route path={ROUTES.FAMILY_ONBOARDING_LINK} element={<FamilyLinkPage />} />
                    </Route>

                    {/* Family dashboard — FAMILY role, onboarding COMPLETE */}
                    <Route element={<FamilyDashboardGuard />}>
                        <Route path="/family" element={<FamilyLayout />}>
                            <Route index element={<FamilyDashboardPage />} />
                            <Route path="timeline" element={<FamilyTimelinePage />} />
                            <Route path="medications" element={<FamilyMedicationsPage />} />
                            <Route path="wallet" element={<FamilyWalletPage />} />
                            <Route path="service-requests" element={<FamilyServiceRequestsPage />} />
                        </Route>
                    </Route>
                </Route>

            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
