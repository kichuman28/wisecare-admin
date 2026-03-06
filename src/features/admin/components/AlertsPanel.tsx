import type { Alert } from '../admin.types';
import { useResolveAlert } from '../admin.hooks';
import { useAuth } from '@/features/auth';
import { AlertCriticalIcon, AlertTriangleIcon, InfoIcon, CheckCircleIcon } from '@/shared/components';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Severity styling
// ---------------------------------------------------------------------------

const severityStyles: Record<string, { badge: string; border: string }> = {
    CRITICAL: { badge: 'bg-red-100 text-red-700 border-red-200', border: 'border-l-red-500' },
    HIGH: { badge: 'bg-orange-100 text-orange-700 border-orange-200', border: 'border-l-orange-500' },
    MEDIUM: { badge: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-l-amber-500' },
    WARNING: { badge: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-l-amber-500' },
    INFO: { badge: 'bg-accent-blue/10 text-icon-shield border-accent-blue/30', border: 'border-l-accent-blue' },
};

const severityIcons: Record<string, ReactNode> = {
    CRITICAL: <AlertCriticalIcon size={18} className="text-red-500" />,
    HIGH: <AlertTriangleIcon size={18} className="text-orange-500" />,
    MEDIUM: <AlertTriangleIcon size={18} className="text-amber-500" />,
    WARNING: <AlertTriangleIcon size={18} className="text-amber-500" />,
    INFO: <InfoIcon size={18} className="text-accent-blue" />,
};

// ---------------------------------------------------------------------------
// Alert row
// ---------------------------------------------------------------------------

function AlertRow({ alert }: { alert: Alert }) {
    const { user } = useAuth();
    const resolveMutation = useResolveAlert();
    const styles = severityStyles[alert.severity] ?? severityStyles.INFO;

    const handleResolve = () => {
        if (!user) return;
        resolveMutation.mutate({ alertId: alert.alertId, data: { resolvedBy: user.userId } });
    };

    const resolving = resolveMutation.isPending && resolveMutation.variables?.alertId === alert.alertId;

    return (
        <div className={`flex items-start gap-3 rounded-xl border border-l-4 bg-card-surface p-4 shadow-sm transition-all hover:shadow-md ${styles.border}`}>
            <span className="mt-0.5">{severityIcons[alert.severity] ?? severityIcons.INFO}</span>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${styles.badge}`}>
                        {alert.severity}
                    </span>
                    <span className="text-xs text-text-muted">{(alert.type ?? '').replace(/_/g, ' ')}</span>
                    {alert.elderlyName && (
                        <>
                            <span className="text-xs text-outline">•</span>
                            <span className="text-xs font-medium text-on-background">{alert.elderlyName}</span>
                        </>
                    )}
                    <span className="text-xs text-outline">•</span>
                    <span className="text-xs text-text-muted">{new Date(alert.timestamp).toLocaleString('en-IN')}</span>
                </div>
                <p className="mt-1 text-sm text-on-background">{alert.message}</p>
            </div>

            {!alert.resolved ? (
                <button type="button" onClick={handleResolve} disabled={resolving}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 transition-all hover:bg-green-100 disabled:opacity-50">
                    <CheckCircleIcon size={14} />
                    {resolving ? 'Resolving…' : 'Resolve'}
                </button>
            ) : (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                    <CheckCircleIcon size={14} /> Resolved
                </span>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// AlertsPanel — now accepts flat alerts array
// ---------------------------------------------------------------------------

interface AlertsPanelProps {
    alerts: Alert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
    return (
        <div className="flex flex-col gap-3">
            {alerts.map((alert) => (
                <AlertRow key={alert.alertId} alert={alert} />
            ))}
        </div>
    );
}
