import { AlertsPanel } from '../components/AlertsPanel';
import type { ElderlyAlertGroup } from '../admin.types';

// ---------------------------------------------------------------------------
// AlertsPage
// ---------------------------------------------------------------------------

// Placeholder data to demonstrate the UI structure
const DEMO_ALERT_GROUPS: ElderlyAlertGroup[] = [
    {
        elderlyUserId: 'demo-elderly-1',
        elderlyName: 'Raghav Kumar',
        alerts: [
            {
                alertId: 'alert-1',
                type: 'FALL_DETECTED',
                severity: 'CRITICAL',
                message: 'Fall detected in living room. No response for 5 minutes.',
                timestamp: new Date().toISOString(),
                resolved: false,
            },
            {
                alertId: 'alert-2',
                type: 'MEDICATION_MISSED',
                severity: 'WARNING',
                message: 'Morning medication (Metformin) was not taken.',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                resolved: false,
            },
        ],
    },
    {
        elderlyUserId: 'demo-elderly-2',
        elderlyName: 'Lakshmi Devi',
        alerts: [
            {
                alertId: 'alert-3',
                type: 'HEALTH_ANOMALY',
                severity: 'INFO',
                message: 'Blood pressure reading slightly elevated: 145/92.',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                resolved: true,
            },
        ],
    },
];

export function AlertsPage() {
    const alertGroups = DEMO_ALERT_GROUPS;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-on-background">Alerts</h1>
                <p className="mt-1 text-sm text-text-muted">
                    Monitor and resolve health alerts across all elderly users.
                </p>
            </div>

            {/* Info banner */}
            <div className="rounded-xl border border-navy/20 bg-navy/5 p-4 text-sm text-navy">
                <strong>Note:</strong> Alerts are currently shown with sample data.
                Connect this page to{' '}
                <code className="rounded bg-navy/10 px-1.5 py-0.5 font-mono text-xs">
                    GET /alerts/user/{'userId'}
                </code>{' '}
                for each elderly user to display real alerts.
            </div>

            {/* Alert groups */}
            <AlertsPanel alertGroups={alertGroups} />
        </div>
    );
}
