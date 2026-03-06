import type { AdminStatsResponse } from '../admin.types';
import { ClipboardIcon, RefreshIcon, UsersIcon, AlertIcon, CheckCircleIcon, ActivityIcon } from '@/shared/components';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

interface StatCardProps {
    label: string;
    value: number | string | undefined;
    icon: ReactNode;
    gradient: string;
    loading: boolean;
    subtitle?: string;
}

function StatCard({ label, value, icon, gradient, loading, subtitle }: StatCardProps) {
    return (
        <div className={`relative overflow-hidden rounded-2xl border border-white/20 p-5 text-white shadow-lg ${gradient}`}>
            <div className="absolute -right-3 -top-3 opacity-10">{icon}</div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/70">{label}</p>
            {loading ? (
                <div className="mt-2 h-8 w-16 animate-pulse rounded-lg bg-white/20" />
            ) : (
                <>
                    <p className="mt-1 text-2xl font-bold">{value ?? '—'}</p>
                    {subtitle && <p className="mt-0.5 text-xs text-white/60">{subtitle}</p>}
                </>
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
            label: 'Pending Requests',
            value: data?.serviceRequests.pending,
            icon: <ClipboardIcon size={56} />,
            gradient: 'bg-gradient-to-br from-primary to-[#c44d1e]',
            loading,
        },
        {
            label: 'Active Requests',
            value: data?.serviceRequests.inProgress,
            icon: <RefreshIcon size={56} />,
            gradient: 'bg-gradient-to-br from-navy to-gradient-bottom',
            loading,
            subtitle: data ? `${data.serviceRequests.assigned} assigned` : undefined,
        },
        {
            label: 'Completed Today',
            value: data?.serviceRequests.completedToday,
            icon: <CheckCircleIcon size={56} />,
            gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
            loading,
            subtitle: data ? `${data.serviceRequests.totalCompleted} total` : undefined,
        },
        {
            label: 'Total Users',
            value: data?.users.total,
            icon: <UsersIcon size={56} />,
            gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
            loading,
            subtitle: data ? `${data.users.elderly} elderly · ${data.users.agents} agents` : undefined,
        },
        {
            label: 'Unresolved Alerts',
            value: data?.alerts.totalUnresolved,
            icon: <AlertIcon size={56} />,
            gradient: data?.alerts.critical ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-amber-500 to-orange-600',
            loading,
            subtitle: data?.alerts.critical ? `${data.alerts.critical} critical` : 'No critical',
        },
        {
            label: 'Total Requests',
            value: data?.serviceRequests.total,
            icon: <ActivityIcon size={56} />,
            gradient: 'bg-gradient-to-br from-cyan-500 to-blue-600',
            loading,
            subtitle: data ? `${data.serviceRequests.rejected} rejected` : undefined,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {stats.map((s) => (
                <StatCard key={s.label} {...s} />
            ))}
        </div>
    );
}
