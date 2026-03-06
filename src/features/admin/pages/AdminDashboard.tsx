import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { AdminStats } from '../components/AdminStats';
import { usePendingRequests } from '../admin.hooks';
import { LoadingState, EmptyState, RequestsIcon, AlertIcon } from '@/shared/components';
import { RequestsTable } from '../components/RequestsTable';

export function AdminDashboard() {
    const { data, isLoading, isError } = usePendingRequests();

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-on-background">Dashboard</h1>
                <p className="mt-1 text-sm text-text-muted">
                    Platform overview — monitor requests, agents, and alerts.
                </p>
            </div>

            {/* Stats widgets */}
            <AdminStats />

            {/* Quick actions */}
            <div className="flex flex-wrap gap-3">
                <Link
                    to={ROUTES.ADMIN_SERVICE_REQUESTS}
                    className="inline-flex items-center gap-2 rounded-xl bg-card-surface px-4 py-2.5 text-sm font-medium text-on-background shadow-sm ring-1 ring-outline transition-all hover:shadow-md hover:ring-primary/30"
                >
                    <RequestsIcon size={16} className="text-primary" />
                    Manage Requests
                </Link>
                <Link
                    to={ROUTES.ADMIN_ALERTS}
                    className="inline-flex items-center gap-2 rounded-xl bg-card-surface px-4 py-2.5 text-sm font-medium text-on-background shadow-sm ring-1 ring-outline transition-all hover:shadow-md hover:ring-primary/30"
                >
                    <AlertIcon size={16} className="text-primary" />
                    View Alerts
                </Link>
            </div>

            {/* Recent pending requests preview */}
            <div>
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-on-background">
                        Recent Pending Requests
                    </h2>
                    <Link
                        to={ROUTES.ADMIN_SERVICE_REQUESTS}
                        className="text-sm font-semibold text-primary hover:text-primary-hover"
                    >
                        View all →
                    </Link>
                </div>

                {isLoading && <LoadingState message="Loading pending requests…" />}

                {isError && (
                    <div className="rounded-xl border border-red-200 bg-error-light p-4 text-sm text-error">
                        Failed to load pending requests. Please try again later.
                    </div>
                )}

                {data && data.requests.length === 0 && (
                    <EmptyState
                        title="No pending requests"
                        description="All service requests have been assigned or processed."
                        icon="✅"
                    />
                )}

                {data && data.requests.length > 0 && (
                    <RequestsTable
                        requests={data.requests.slice(0, 5)}
                        onAssign={() => {
                            window.location.href = ROUTES.ADMIN_SERVICE_REQUESTS;
                        }}
                    />
                )}
            </div>
        </div>
    );
}
