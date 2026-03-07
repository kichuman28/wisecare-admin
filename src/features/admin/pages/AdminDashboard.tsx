import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { AdminStats } from '../components/AdminStats';
import { ActivityAreaChart, DistributionBarChart, UserDistributionChart } from '../components/DashboardCharts';
import { useAdminStats } from '../admin.hooks';
import { LoadingState, RequestsIcon, AlertIcon, AlertTriangleIcon } from '@/shared/components';
import type { AdminStatsResponse } from '../admin.types';

// ---------------------------------------------------------------------------
// Recent request row
// ---------------------------------------------------------------------------

function RecentRequestRow({ r }: { r: AdminStatsResponse['recentRequests'][number] }) {
    return (
        <div className="group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-primary/5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <RequestsIcon size={18} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-on-background">{r.title}</p>
                <p className="text-xs text-text-muted">{r.elderlyName}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${r.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                r.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
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
        <div className="group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-red-50/50">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${a.severity === 'CRITICAL' ? 'bg-red-100 text-red-600 group-hover:bg-red-200' :
                a.severity === 'HIGH' ? 'bg-orange-100 text-orange-600 group-hover:bg-orange-200' :
                    'bg-amber-100 text-amber-600 group-hover:bg-amber-200'
                }`}>
                <AlertTriangleIcon size={18} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-on-background">{a.message}</p>
                <p className="text-xs text-text-muted">{a.type.replace(/_/g, ' ')}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${a.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
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
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-on-background">
                        Dashboard Overview
                    </h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Real-time platform analytics — requests, users, and alerts.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link to={ROUTES.ADMIN_SERVICE_REQUESTS}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/40">
                        <RequestsIcon size={16} />
                        Requests
                    </Link>
                    <Link to={ROUTES.ADMIN_ALERTS}
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-on-background ring-1 ring-outline transition-all hover:-translate-y-0.5 hover:shadow-md">
                        <AlertIcon size={16} className="text-primary" />
                        Alerts
                    </Link>
                </div>
            </div>

            {isError && (
                <div className="rounded-2xl border border-red-200 bg-error-light p-4 text-sm font-medium text-error">
                    Failed to load dashboard stats. Please check your connection and try again.
                </div>
            )}

            {/* KPI Stat Cards */}
            <div className="animate-fade-in-up delay-100">
                <AdminStats data={data} loading={isLoading} />
            </div>

            {/* Charts — 3 columns: area (spanning 2) + bar (1) */}
            {data && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 animate-fade-in-up delay-200">
                    <div className="lg:col-span-2">
                        <ActivityAreaChart />
                    </div>
                    <div>
                        <DistributionBarChart typeBreakdown={data.serviceRequests.typeBreakdown} />
                    </div>
                </div>
            )}

            {/* Bottom row — Recent items + Donut */}
            {data && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 animate-fade-in-up delay-300">
                    {/* Recent Requests */}
                    <div className="glass-panel glass-card-hover flex flex-col rounded-2xl p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-extrabold tracking-tight text-on-background">Recent Requests</h2>
                            <Link to={ROUTES.ADMIN_SERVICE_REQUESTS}
                                className="rounded-lg px-2.5 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary/10">
                                View all →
                            </Link>
                        </div>
                        {data.recentRequests.length === 0 ? (
                            <p className="py-10 text-center text-sm text-text-muted">No recent requests.</p>
                        ) : (
                            <div className="space-y-1">
                                {data.recentRequests.slice(0, 5).map((r) => (
                                    <RecentRequestRow key={r.requestId} r={r} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Alerts */}
                    <div className="glass-panel glass-card-hover flex flex-col rounded-2xl p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-extrabold tracking-tight text-on-background">Recent Alerts</h2>
                            <Link to={ROUTES.ADMIN_ALERTS}
                                className="rounded-lg px-2.5 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary/10">
                                View all →
                            </Link>
                        </div>
                        {data.recentAlerts.length === 0 ? (
                            <p className="py-10 text-center text-sm text-text-muted">No recent alerts.</p>
                        ) : (
                            <div className="space-y-1">
                                {data.recentAlerts.slice(0, 5).map((a) => (
                                    <RecentAlertRow key={a.alertId} a={a} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* User Distribution Donut */}
                    <div>
                        <UserDistributionChart users={data.users} />
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="animate-fade-in-up">
                    <LoadingState message="Loading platform analytics…" />
                </div>
            )}
        </div>
    );
}
