import type { ElderlyAlertGroup, Alert, AlertSeverity } from '../admin.types';
import { useResolveAlert } from '../admin.hooks';
import { useAuth } from '@/features/auth';
import { EmptyState, AlertCriticalIcon, AlertTriangleIcon, InfoIcon, AlertIcon, CheckCircleIcon } from '@/shared/components';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Severity styling
// ---------------------------------------------------------------------------

const severityStyles: Record<AlertSeverity, { badge: string; border: string }> = {
    CRITICAL: {
        badge: 'bg-red-100 text-red-700 border-red-200',
        border: 'border-l-red-500',
    },
    WARNING: {
        badge: 'bg-amber-100 text-amber-700 border-amber-200',
        border: 'border-l-amber-500',
    },
    INFO: {
        badge: 'bg-accent-blue/10 text-icon-shield border-accent-blue/30',
        border: 'border-l-accent-blue',
    },
};

const severityIcons: Record<AlertSeverity, ReactNode> = {
    CRITICAL: <AlertCriticalIcon size={18} className="text-red-500" />,
    WARNING: <AlertTriangleIcon size={18} className="text-amber-500" />,
    INFO: <InfoIcon size={18} className="text-accent-blue" />,
};

// ---------------------------------------------------------------------------
// Alert row
// ---------------------------------------------------------------------------

interface AlertRowProps {
    alert: Alert;
    onResolve: (alertId: string) => void;
    resolving: boolean;
}

function AlertRow({ alert, onResolve, resolving }: AlertRowProps) {
    const styles = severityStyles[alert.severity];

    return (
        <div
            className={`flex items-start gap-3 rounded-xl border border-l-4 bg-card-surface p-4 shadow-sm transition-all hover:shadow-md ${styles.border}`}
        >
            <span className="mt-0.5">{severityIcons[alert.severity]}</span>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${styles.badge}`}
                    >
                        {alert.severity}
                    </span>
                    <span className="text-xs text-text-muted">
                        {alert.type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-outline">•</span>
                    <span className="text-xs text-text-muted">
                        {new Date(alert.timestamp).toLocaleString('en-IN')}
                    </span>
                </div>
                <p className="mt-1 text-sm text-on-background">{alert.message}</p>
            </div>

            {!alert.resolved && (
                <button
                    type="button"
                    onClick={() => onResolve(alert.alertId)}
                    disabled={resolving}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 transition-all hover:bg-green-100 disabled:opacity-50"
                >
                    <CheckCircleIcon size={14} />
                    {resolving ? 'Resolving…' : 'Resolve'}
                </button>
            )}

            {alert.resolved && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                    <CheckCircleIcon size={14} />
                    Resolved
                </span>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// AlertsPanel
// ---------------------------------------------------------------------------

interface AlertsPanelProps {
    alertGroups: ElderlyAlertGroup[];
}

export function AlertsPanel({ alertGroups }: AlertsPanelProps) {
    const { user } = useAuth();
    const resolveMutation = useResolveAlert();

    const handleResolve = (alertId: string) => {
        if (!user) return;
        resolveMutation.mutate({
            alertId,
            data: { resolvedBy: user.userId },
        });
    };

    if (alertGroups.length === 0) {
        return (
            <EmptyState
                title="No alerts"
                description="There are currently no alerts to display."
                icon="🔔"
            />
        );
    }

    return (
        <div className="space-y-6">
            {alertGroups.map((group) => (
                <div key={group.elderlyUserId}>
                    {/* Group header */}
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-navy to-icon-shield text-xs font-bold text-white">
                            {group.elderlyName.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-on-background">
                                {group.elderlyName}
                            </p>
                            <p className="text-xs text-text-muted">
                                {group.alerts.filter((a) => !a.resolved).length} unresolved
                            </p>
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="flex flex-col gap-2 pl-4">
                        {group.alerts.map((alert) => (
                            <AlertRow
                                key={alert.alertId}
                                alert={alert}
                                onResolve={handleResolve}
                                resolving={
                                    resolveMutation.isPending &&
                                    resolveMutation.variables?.alertId === alert.alertId
                                }
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
