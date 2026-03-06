import { useState } from 'react';
import { useAlerts } from '../admin.hooks';
import { AlertsPanel } from '../components/AlertsPanel';
import { LoadingState, EmptyState, AlertIcon } from '@/shared/components';
import type { AlertFilters } from '../admin.types';

const SEVERITY_OPTIONS = [
    { label: 'All Severities', value: '' },
    { label: 'Critical', value: 'CRITICAL' },
    { label: 'High', value: 'HIGH' },
    { label: 'Medium', value: 'MEDIUM' },
];

const TYPE_OPTIONS = [
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

    const filters: AlertFilters = {};
    if (severity) filters.severity = severity as AlertFilters['severity'];
    if (type) filters.type = type;
    filters.resolved = showResolved;

    const { data, isLoading, isError } = useAlerts(filters);

    const selectClasses = 'rounded-lg border border-outline bg-card-surface px-3 py-2 text-sm text-on-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

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
            <div className="flex flex-wrap items-center gap-3">
                <select value={severity} onChange={(e) => setSeverity(e.target.value)} className={selectClasses}>
                    {SEVERITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <select value={type} onChange={(e) => setType(e.target.value)} className={selectClasses}>
                    {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <label className="flex items-center gap-2 text-sm text-text-muted">
                    <input type="checkbox" checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)}
                        className="h-4 w-4 rounded border-outline text-primary focus:ring-primary" />
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

            {data && data.alerts.length > 0 && (
                <AlertsPanel alerts={data.alerts} />
            )}
        </div>
    );
}
