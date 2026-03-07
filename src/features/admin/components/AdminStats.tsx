import type { AdminStatsResponse } from '../admin.types';
import { ClipboardIcon, RefreshIcon, UsersIcon, AlertIcon, CheckCircleIcon, ActivityIcon } from '@/shared/components';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Stat card — bold, clean, no tiny charts
// ---------------------------------------------------------------------------

interface StatCardProps {
    label: string;
    value: number | string | undefined;
    icon: ReactNode;
    gradient: string;
    loading: boolean;
    subtitle?: string;
    trend?: string;
}

function StatCard({ label, value, icon, gradient, loading, subtitle, trend }: StatCardProps) {
    return (
        <div className={`group relative overflow-hidden rounded-2xl p-5 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${gradient}`}>
            {/* Background decoration */}
            <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-[0.15] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                {icon}
            </div>

            {/* Top row: icon + label */}
            <div className="relative z-10 mb-4 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <span className="scale-90">{icon}</span>
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/80">{label}</p>
            </div>

            {/* Value */}
            <div className="relative z-10">
                {loading ? (
                    <div className="h-10 w-20 animate-pulse rounded-lg bg-white/20" />
                ) : (
                    <p className="text-4xl font-extrabold tracking-tight">{value ?? '—'}</p>
                )}
            </div>

            {/* Subtitle / trend */}
            {(subtitle || trend) && !loading && (
                <div className="relative z-10 mt-2 flex items-center gap-2">
                    {subtitle && <p className="text-sm font-medium text-white/70">{subtitle}</p>}
                    {trend && (
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
                            {trend}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// AdminStats — accepts stats data as prop
// ---------------------------------------------------------------------------

interface AdminStatsProps {
    data?: AdminStatsResponse;
    loading: boolean;
}

export function AdminStats({ data, loading }: AdminStatsProps) {
    const stats: StatCardProps[] = [
        {
            label: 'Pending',
            value: data?.serviceRequests.pending,
            icon: <ClipboardIcon size={56} />,
            gradient: 'bg-gradient-to-br from-[#FF6933] to-[#E54D20]',
            loading,
            subtitle: data ? `of ${data.serviceRequests.total} total` : undefined,
        },
        {
            label: 'Active',
            value: data?.serviceRequests.inProgress,
            icon: <RefreshIcon size={56} />,
            gradient: 'bg-gradient-to-br from-[#1F234D] to-[#2D3561]',
            loading,
            subtitle: data ? `${data.serviceRequests.assigned} assigned` : undefined,
        },
        {
            label: 'Completed',
            value: data?.serviceRequests.completedToday,
            icon: <CheckCircleIcon size={56} />,
            gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
            loading,
            subtitle: data ? `${data.serviceRequests.totalCompleted} lifetime` : undefined,
        },
        {
            label: 'Users',
            value: data?.users.total,
            icon: <UsersIcon size={56} />,
            gradient: 'bg-gradient-to-br from-violet-500 to-purple-700',
            loading,
            subtitle: data ? `${data.users.elderly} elderly · ${data.users.agents} agents` : undefined,
        },
        {
            label: 'Alerts',
            value: data?.alerts.totalUnresolved,
            icon: <AlertIcon size={56} />,
            gradient: data?.alerts.critical
                ? 'bg-gradient-to-br from-red-500 to-rose-700'
                : 'bg-gradient-to-br from-amber-500 to-orange-600',
            loading,
            subtitle: data?.alerts.critical ? `${data.alerts.critical} critical` : 'No critical',
        },
        {
            label: 'Total Reqs',
            value: data?.serviceRequests.total,
            icon: <ActivityIcon size={56} />,
            gradient: 'bg-gradient-to-br from-cyan-500 to-blue-700',
            loading,
            subtitle: data ? `${data.serviceRequests.rejected} rejected` : undefined,
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {stats.map((s, i) => (
                <div key={s.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                    <StatCard {...s} />
                </div>
            ))}
        </div>
    );
}
