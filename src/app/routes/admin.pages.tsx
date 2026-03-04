// ---------------------------------------------------------------------------
// Admin pages — wired to the admin feature module
// ---------------------------------------------------------------------------

export { AdminDashboard as AdminDashboardPage } from '@/features/admin';
export { RequestsPage as AdminServiceRequestsPage } from '@/features/admin';
export { AlertsPage as AdminAlertsPage } from '@/features/admin';

// Users page — placeholder until backend API is available
export function AdminUsersPage() {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                <p className="mt-1 text-sm text-gray-500">
                    User management — list, create agents, activate/deactivate.
                </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                <strong>Coming soon:</strong> User management requires a{' '}
                <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">
                    GET /admin/users
                </code>{' '}
                backend endpoint that is not yet available.
            </div>
        </div>
    );
}
