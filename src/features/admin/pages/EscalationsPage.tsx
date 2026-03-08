import { useState, useMemo, useEffect } from 'react';
import { useEscalations, useEscalationStats, useResolveEscalation } from '../admin.hooks';
import { LoadingState, EmptyState, AlertTriangleIcon, CheckCircleIcon, CustomSelect, Pagination, RefreshButton } from '@/shared/components';
import type { SelectOption } from '@/shared/components/CustomSelect';
import type { Escalation, EscalationPriority, EscalationResolution } from '../admin.types';

const PRIORITY_TABS: { label: string; value: string | undefined }[] = [
    { label: 'All', value: undefined },
    { label: 'Critical', value: 'CRITICAL' },
    { label: 'High', value: 'HIGH' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Low', value: 'LOW' },
];

const PRIORITY_BADGE: Record<EscalationPriority, string> = {
    CRITICAL: 'bg-red-100 text-red-700',
    HIGH: 'bg-orange-100 text-orange-700',
    MEDIUM: 'bg-amber-100 text-amber-700',
    LOW: 'bg-gray-100 text-gray-700',
};

const RESOLUTION_OPTIONS: SelectOption<EscalationResolution>[] = [
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Manual Completed', value: 'MANUAL_COMPLETED' },
    { label: 'Resolved', value: 'RESOLVED' },
];

// ---------------------------------------------------------------------------
// Escalation card
// ---------------------------------------------------------------------------

function EscalationCard({ escalation }: { escalation: Escalation }) {
    const [showResolve, setShowResolve] = useState(false);
    const [resolution, setResolution] = useState<EscalationResolution>('RESOLVED');
    const [notes, setNotes] = useState('');
    const resolveMutation = useResolveEscalation();

    const handleResolve = () => {
        resolveMutation.mutate(
            { escalationId: escalation.escalationId, data: { resolution, notes } },
            { onSuccess: () => setShowResolve(false) },
        );
    };

    return (
        <div className="rounded-xl border border-outline bg-card-surface p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${escalation.priority === 'CRITICAL' ? 'bg-red-100' :
                    escalation.priority === 'HIGH' ? 'bg-orange-100' :
                        'bg-amber-100'
                    }`}>
                    <AlertTriangleIcon size={16} className={
                        escalation.priority === 'CRITICAL' ? 'text-red-500' :
                            escalation.priority === 'HIGH' ? 'text-orange-500' :
                                'text-amber-500'
                    } />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-on-background">{escalation.title}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_BADGE[escalation.priority]}`}>
                            {escalation.priority}
                        </span>
                        <span className="rounded-full bg-navy/10 px-2 py-0.5 text-[10px] font-medium text-navy">
                            {escalation.category}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-text-muted">{escalation.description}</p>
                    <p className="mt-2 text-xs text-on-background">
                        <span className="font-medium">Reason:</span> {escalation.escalationReason}
                    </p>
                    <p className="mt-1 text-xs text-primary">
                        <span className="font-medium">Suggested:</span> {escalation.suggestedAction}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                        <span>User: <strong className="text-on-background">{escalation.userName}</strong> ({escalation.userCity})</span>
                        <span>Cost: ${escalation.cost.toFixed(4)}</span>
                        <span>Time: {escalation.executionTime.toFixed(1)}s</span>
                        {escalation.toolsUsed.length > 0 && (
                            <span>Tools: {escalation.toolsUsed.join(', ')}</span>
                        )}
                    </div>
                </div>

                {!showResolve && (
                    <button type="button" onClick={() => setShowResolve(true)}
                        className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover">
                        Resolve
                    </button>
                )}
            </div>

            {/* Resolve form */}
            {showResolve && (
                <div className="mt-4 rounded-lg bg-warm-bg p-4">
                    <div className="flex flex-wrap gap-3">
                        <CustomSelect
                            value={resolution}
                            options={RESOLUTION_OPTIONS}
                            onChange={(val) => setResolution(val as EscalationResolution)}
                        />
                        <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes…"
                            className="min-w-0 flex-1 rounded-lg border border-outline bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        <button type="button" onClick={handleResolve} disabled={resolveMutation.isPending}
                            className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                            <CheckCircleIcon size={14} />
                            {resolveMutation.isPending ? 'Saving…' : 'Submit'}
                        </button>
                        <button type="button" onClick={() => setShowResolve(false)}
                            className="rounded-lg px-3 py-2 text-xs text-text-muted hover:text-on-background">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// EscalationsPage
// ---------------------------------------------------------------------------

export function EscalationsPage() {
    const [priorityFilter, setPriorityFilter] = useState<string | undefined>(undefined);
    const [statsPeriod, setStatsPeriod] = useState('7d');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    const { data, isLoading, isError, refetch, isRefetching } = useEscalations(priorityFilter);
    const { data: stats, refetch: refetchStats, isRefetching: isRefetchingStats } = useEscalationStats(statsPeriod);

    // Reset pagination
    useEffect(() => {
        setCurrentPage(1);
    }, [priorityFilter, pageSize]);

    const escalations = data?.escalations || [];
    const paginatedEscalations = useMemo(() => {
        return escalations.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }, [escalations, currentPage, pageSize]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-on-background">Escalations</h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Tasks the AI agent couldn't complete — needs your attention.
                    </p>
                </div>
                <RefreshButton
                    onClick={() => {
                        refetch();
                        refetchStats();
                    }}
                    isLoading={isLoading || isRefetching || isRefetchingStats}
                    className="mt-1"
                />
            </div>

            {/* Stats bar */}
            {stats && (
                <div className="flex flex-wrap items-center gap-4 rounded-xl bg-gradient-to-r from-navy to-gradient-bottom p-4 text-white">
                    <div>
                        <p className="text-xs text-white/60">Period</p>
                        <CustomSelect
                            value={statsPeriod}
                            options={[
                                { label: 'Last 24h', value: '24h' },
                                { label: 'Last 7 days', value: '7d' },
                                { label: 'Last 30 days', value: '30d' },
                            ]}
                            onChange={setStatsPeriod}
                            className="mt-0.5"
                        />
                    </div>
                    <div className="h-8 w-px bg-white/20" />
                    <StatItem label="Total Escalations" value={stats.totalEscalations} />
                    <StatItem label="Total Tasks" value={stats.totalTasks} />
                    <StatItem label="Escalation Rate" value={`${stats.escalationRate.toFixed(1)}%`} />
                    <StatItem label="Trend" value={stats.trend.charAt(0).toUpperCase() + stats.trend.slice(1)} />
                </div>
            )}

            {/* Priority tabs */}
            <div className="flex flex-wrap gap-1 rounded-xl bg-surface p-1 ring-1 ring-outline">
                {PRIORITY_TABS.map((tab) => (
                    <button key={tab.label} type="button"
                        onClick={() => setPriorityFilter(tab.value)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${priorityFilter === tab.value
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-text-muted hover:text-on-background'}`}>
                        {tab.label}
                        {data?.summary && tab.value && (
                            <span className="ml-1.5 text-xs opacity-70">
                                ({data.summary[tab.value.toLowerCase() as keyof typeof data.summary]})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            {isLoading && <LoadingState message="Loading escalations…" />}
            {isError && (
                <div className="rounded-xl border border-red-200 bg-error-light p-4 text-sm text-error">
                    Failed to load escalations.
                </div>
            )}
            {data && escalations.length === 0 && (
                <EmptyState title="No escalations" description="All clear — no pending escalations right now." icon="🎉" />
            )}
            {data && escalations.length > 0 && (
                <div className="space-y-4">
                    <Pagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={escalations.length}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                    />
                    <div className="space-y-4">
                        {paginatedEscalations.map((e) => (
                            <EscalationCard key={e.escalationId} escalation={e} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
    return (
        <div>
            <p className="text-[10px] text-white/60">{label}</p>
            <p className="text-lg font-bold">{value}</p>
        </div>
    );
}
