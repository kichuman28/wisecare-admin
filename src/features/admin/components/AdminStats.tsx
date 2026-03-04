import { usePendingRequests, useInProgressRequests, useAvailableAgents } from '../admin.hooks';

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

interface StatCardProps {
    label: string;
    value: number | undefined;
    icon: string;
    gradient: string;
    loading: boolean;
}

function StatCard({ label, value, icon, gradient, loading }: StatCardProps) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl border border-white/20 p-6 text-white shadow-lg ${gradient}`}
        >
            {/* Background icon */}
            <span className="absolute -right-2 -top-2 text-6xl opacity-20">
                {icon}
            </span>

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
            icon: '📋',
            gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
            loading: pending.isLoading,
        },
        {
            label: 'Active Requests',
            value: active.data?.requests.length,
            icon: '🔄',
            gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
            loading: active.isLoading,
        },
        {
            label: 'Available Agents',
            value: agents.data?.agents.length,
            icon: '👥',
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
