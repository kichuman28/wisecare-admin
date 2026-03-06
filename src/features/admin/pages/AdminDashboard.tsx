import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { AdminStats } from '../components/AdminStats';
import { useAdminStats } from '../admin.hooks';
import { LoadingState, RequestsIcon, AlertIcon, AlertTriangleIcon } from '@/shared/components';
import type { AdminStatsResponse } from '../admin.types';

// ---------------------------------------------------------------------------
// Recent request row
// ---------------------------------------------------------------------------

function RecentRequestRow({ r }: { r: AdminStatsResponse['recentRequests'][number] }) {
    return (
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-warm-bg">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <RequestsIcon size={16} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-on-background">{r.title}</p>
                <p className="text-xs text-text-muted">{r.elderlyName}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${r.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    r.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                }`}>
                {r.status}
            </span>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Recent alert row
// ---------------------------------------------------------------------------

function RecentAlertRow({ a }: { a: AdminStatsResponse['recentAlerts'][number] }) {
    return (
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-warm-bg">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${a.severity === 'CRITICAL' ? 'bg-red-100 text-red-500' :
                    a.severity === 'HIGH' ? 'bg-orange-100 text-orange-500' :
                        'bg-amber-100 text-amber-500'
                }`}>
                <AlertTriangleIcon size={16} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-on-background">{a.message}</p>
                <p className="text-xs text-text-muted">{a.type.replace(/_/g, ' ')}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${a.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                    a.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                        'bg-amber-100 text-amber-700'
                }`}>
                {a.severity}
            </span>
        </div>
    );
}

// ---------------------------------------------------------------------------
// AdminDashboard
// ---------------------------------------------------------------------------

export function AdminDashboard() {
    const { data, isLoading, isError } = useAdminStats();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-on-background">Dashboard</h1>
                <p className="mt-1 text-sm text-text-muted">
                    Platform overview — monitor requests, agents, and alerts.
                </p>
            </div>

            {/* Stats */}
            <AdminStats data={data} loading={isLoading} />

            {isError && (
                <div className="rounded-xl border border-red-200 bg-error-light p-4 text-sm text-error">
                    Failed to load dashboard stats. Please check your connection and try again.
                </div>
            )}

            {/* Quick actions */}
            <div className="flex flex-wrap gap-3">
                <Link to={ROUTES.ADMIN_SERVICE_REQUESTS}
                    className="inline-flex items-center gap-2 rounded-xl bg-card-surface px-4 py-2.5 text-sm font-medium text-on-background shadow-sm ring-1 ring-outline transition-all hover:shadow-md hover:ring-primary/30">
                    <RequestsIcon size={16} className="text-primary" />
                    Manage Requests
                </Link>
                <Link to={ROUTES.ADMIN_ALERTS}
                    className="inline-flex items-center gap-2 rounded-xl bg-card-surface px-4 py-2.5 text-sm font-medium text-on-background shadow-sm ring-1 ring-outline transition-all hover:shadow-md hover:ring-primary/30">
                    <AlertIcon size={16} className="text-primary" />
                    View Alerts
                </Link>
                <Link to={ROUTES.ADMIN_ESCALATIONS}
                    className="inline-flex items-center gap-2 rounded-xl bg-card-surface px-4 py-2.5 text-sm font-medium text-on-background shadow-sm ring-1 ring-outline transition-all hover:shadow-md hover:ring-primary/30">
                    <AlertTriangleIcon size={16} className="text-primary" />
                    Escalations
                </Link>
            </div>

            {/* Recent items grid */}
            {data && (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {/* Recent Requests */}
                    <div className="rounded-xl border border-outline bg-card-surface p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-on-background">Recent Requests</h2>
                            <Link to={ROUTES.ADMIN_SERVICE_REQUESTS}
                                className="text-xs font-semibold text-primary hover:text-primary-hover">
                                View all →
                            </Link>
                        </div>
                        {data.recentRequests.length === 0 ? (
                            <p className="py-6 text-center text-sm text-text-muted">No recent requests</p>
                        ) : (
                            <div className="space-y-1">
                                {data.recentRequests.slice(0, 5).map((r) => (
                                    <RecentRequestRow key={r.requestId} r={r} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Alerts */}
                    <div className="rounded-xl border border-outline bg-card-surface p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-on-background">Recent Alerts</h2>
                            <Link to={ROUTES.ADMIN_ALERTS}
                                className="text-xs font-semibold text-primary hover:text-primary-hover">
                                View all →
                            </Link>
                        </div>
                        {data.recentAlerts.length === 0 ? (
                            <p className="py-6 text-center text-sm text-text-muted">No recent alerts</p>
                        ) : (
                            <div className="space-y-1">
                                {data.recentAlerts.slice(0, 5).map((a) => (
                                    <RecentAlertRow key={a.alertId} a={a} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isLoading && <LoadingState message="Loading dashboard data…" />}
        </div>
    );
}
