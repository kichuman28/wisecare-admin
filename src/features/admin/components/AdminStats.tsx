import { usePendingRequests, useInProgressRequests, useAvailableAgents } from '../admin.hooks';
import { ClipboardIcon, RefreshIcon, UsersIcon } from '@/shared/components';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

interface StatCardProps {
    label: string;
    value: number | undefined;
    icon: ReactNode;
    gradient: string;
    loading: boolean;
}

function StatCard({ label, value, icon, gradient, loading }: StatCardProps) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl border border-white/20 p-6 text-white shadow-lg ${gradient}`}
        >
            {/* Background icon */}
            <div className="absolute -right-3 -top-3 opacity-10">
                {icon}
            </div>

            <p className="text-sm font-medium text-white/80">{label}</p>

            {loading ? (
                <div className="mt-2 h-9 w-16 animate-pulse rounded-lg bg-white/20" />
            ) : (
                <p className="mt-1 text-3xl font-bold">{value ?? '—'}</p>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// AdminStats — three parallel-loading widgets
// ---------------------------------------------------------------------------

export function AdminStats() {
    const pending = usePendingRequests();
    const active = useInProgressRequests();
    const agents = useAvailableAgents();

    const stats: StatCardProps[] = [
        {
            label: 'Pending Requests',
            value: pending.data?.requests.length,
            icon: <ClipboardIcon size={64} />,
            gradient: 'bg-gradient-to-br from-primary to-[#c44d1e]',
            loading: pending.isLoading,
        },
        {
            label: 'Active Requests',
            value: active.data?.requests.length,
            icon: <RefreshIcon size={64} />,
            gradient: 'bg-gradient-to-br from-navy to-gradient-bottom',
            loading: active.isLoading,
        },
        {
            label: 'Available Agents',
            value: agents.data?.agents.length,
            icon: <UsersIcon size={64} />,
            gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
            loading: agents.isLoading,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((s) => (
                <StatCard key={s.label} {...s} />
            ))}
        </div>
    );
}
