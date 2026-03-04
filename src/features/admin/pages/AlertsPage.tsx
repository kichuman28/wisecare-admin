import { AlertsPanel } from '../components/AlertsPanel';
import type { ElderlyAlertGroup } from '../admin.types';

// ---------------------------------------------------------------------------
// AlertsPage
// ---------------------------------------------------------------------------
// Since there is no "GET /alerts/all" endpoint, this page provides the
// AlertsPanel component with alert data. In a real implementation, you would:
// 1. Maintain a list of elderly userIds (from a user management page)
// 2. Fetch alerts for each user: GET /alerts/user/{userId}
// 3. Aggregate into ElderlyAlertGroup[]
//
// For now, we show how the UI renders, and this can be wired to real data
// once the backend provides a bulk endpoint or the admin has access to
// user IDs.
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
    // In production, you would fetch alert groups here using a custom hook
    // that aggregates GET /alerts/user/{userId} calls
    const alertGroups = DEMO_ALERT_GROUPS;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Monitor and resolve health alerts across all elderly users.
                </p>
            </div>

            {/* Info banner */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                <strong>Note:</strong> Alerts are currently shown with sample data.
                Connect this page to{' '}
                <code className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs">
                    GET /alerts/user/{'userId'}
                </code>{' '}
                for each elderly user to display real alerts.
            </div>

            {/* Alert groups */}
            <AlertsPanel alertGroups={alertGroups} />
        </div>
    );
}
