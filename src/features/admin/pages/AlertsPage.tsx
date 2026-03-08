import { useState, useMemo, useEffect } from 'react';
import { useAlerts } from '../admin.hooks';
import { AlertsPanel } from '../components/AlertsPanel';
import { LoadingState, EmptyState, AlertIcon, CustomSelect, Pagination } from '@/shared/components';
import type { SelectOption } from '@/shared/components/CustomSelect';
import type { AlertFilters } from '../admin.types';

const SEVERITY_OPTIONS: SelectOption<string>[] = [
    { label: 'All Severities', value: '' },
    { label: 'Critical', value: 'CRITICAL' },
    { label: 'High', value: 'HIGH' },
    { label: 'Medium', value: 'MEDIUM' },
];

const TYPE_OPTIONS: SelectOption<string>[] = [
    { label: 'All Types', value: '' },
    { label: 'Fall Detected', value: 'FALL_DETECTED' },
    { label: 'High BP', value: 'HIGH_BP' },
    { label: 'Companion Concern', value: 'COMPANION_CONCERN' },
    { label: 'SOS', value: 'SOS' },
];

export function AlertsPage() {
    const [severity, setSeverity] = useState('');
    const [type, setType] = useState('');
    const [showResolved, setShowResolved] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    const filters: AlertFilters = useMemo(() => {
        const f: AlertFilters = {};
        if (severity) f.severity = severity as any;
        if (type) f.type = type;
        f.resolved = showResolved;
        return f;
    }, [severity, type, showResolved]);

    const { data, isLoading, isError } = useAlerts(filters);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [severity, type, showResolved, pageSize]);

    const totalAlerts = data?.alerts.length || 0;
    const paginatedAlerts = useMemo(() => {
        if (!data?.alerts) return [];
        return data.alerts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }, [data?.alerts, currentPage, pageSize]);



    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-on-background">Alerts</h1>
                <p className="mt-1 text-sm text-text-muted">
                    Monitor and resolve health alerts across all elderly users.
                </p>
            </div>

            {/* Summary cards */}
            {data?.summary && (
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: 'Total', value: data.summary.total, color: 'bg-navy/10 text-navy' },
                        { label: 'Critical', value: data.summary.CRITICAL, color: 'bg-red-100 text-red-700' },
                        { label: 'High', value: data.summary.HIGH, color: 'bg-orange-100 text-orange-700' },
                        { label: 'Medium', value: data.summary.MEDIUM, color: 'bg-amber-100 text-amber-700' },
                    ].map((s) => (
                        <div key={s.label} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${s.color}`}>
                            <AlertIcon size={14} />
                            {s.label}: <span className="font-bold">{s.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl bg-surface p-4 ring-1 ring-outline">
                <div className="flex items-center gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Severity</label>
                    <CustomSelect
                        value={severity}
                        options={SEVERITY_OPTIONS}
                        onChange={setSeverity}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Type</label>
                    <CustomSelect
                        value={type}
                        options={TYPE_OPTIONS}
                        onChange={setType}
                    />
                </div>

                <label className="flex items-center gap-2 text-sm font-medium text-text-muted cursor-pointer hover:text-on-background transition-colors">
                    <input
                        type="checkbox"
                        checked={showResolved}
                        onChange={(e) => setShowResolved(e.target.checked)}
                        className="h-4 w-4 rounded border-outline text-primary focus:ring-primary"
                    />
                    Show resolved
                </label>
            </div>

            {/* Content */}
            {isLoading && <LoadingState message="Loading alerts…" />}

            {isError && (
                <div className="rounded-xl border border-red-200 bg-error-light p-4 text-sm text-error">
                    Failed to load alerts. Please try again later.
                </div>
            )}

            {data && data.alerts.length === 0 && (
                <EmptyState title="No alerts found" description="No alerts match the current filters." icon="🔔" />
            )}

            {data && totalAlerts > 0 && (
                <div className="space-y-4">
                    <Pagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={totalAlerts}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                    />
                    <AlertsPanel alerts={paginatedAlerts} />
                </div>
            )}
        </div>
    );
}
