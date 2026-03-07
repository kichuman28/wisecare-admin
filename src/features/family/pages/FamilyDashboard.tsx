import {
    useFamilyProfile,
    useElderlyVitals,
    useElderlyRisk,
    useElderlyAlerts,
    useResolveAlert,
} from '../family.hooks';
import { HeartRateChart, BloodPressureChart } from '../components/VitalsCharts';
import { RiskScoreCard } from '../components/RiskScoreCard';
import { LoadingState, AlertTriangleIcon, CheckCircleIcon } from '@/shared/components';
import type { ElderlyAlert } from '../family.types';

// New Components
import { ElderlyProfileCard } from '../components/ElderlyProfileCard';

// ---------------------------------------------------------------------------
// Alert severity styles
// ---------------------------------------------------------------------------

const SEVERITY_STYLE: Record<string, { bg: string; text: string; icon: string }> = {
    CRITICAL: { bg: 'bg-red-50 ring-1 ring-red-200', text: 'text-red-600', icon: '🚨' },
    HIGH: { bg: 'bg-orange-50 ring-1 ring-orange-200', text: 'text-orange-600', icon: '⚠️' },
    MEDIUM: { bg: 'bg-amber-50 ring-1 ring-amber-200', text: 'text-amber-600', icon: '💡' },
};

// ---------------------------------------------------------------------------
// Alert type icons
// ---------------------------------------------------------------------------

const ALERT_TYPE_ICON: Record<string, string> = {
    FALL_DETECTED: '🚨',
    HIGH_BP: '🩺',
    LOW_OXYGEN: '🩺',
    COMPANION_CONCERN: '💬',
    SOS: '🆘',
    MEDICATION_MISSED: '💊',
    HEALTH_ANOMALY: '⚠️',
};

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------

function timeAgo(ts: string) {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

// ---------------------------------------------------------------------------
// Alert Card
// ---------------------------------------------------------------------------

function AlertCard({
    alert,
    onResolve,
    resolving,
}: {
    alert: ElderlyAlert;
    onResolve: (alertId: string) => void;
    resolving: boolean;
}) {
    const sev = SEVERITY_STYLE[alert.severity] ?? SEVERITY_STYLE.MEDIUM;
    const typeIcon = ALERT_TYPE_ICON[alert.type] ?? '⚠️';

    return (
        <div className={`group flex items-start gap-3 rounded-xl p-4 transition-all duration-200 ${sev.bg}`}>
            <span className="mt-0.5 text-xl">{typeIcon}</span>
            <div className="min-w-0 flex-1">
                <p className={`text-sm font-bold ${sev.text}`}>{alert.message}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                    <span className={`rounded-full px-2 py-0.5 font-bold ${sev.text} bg-white/60`}>
                        {alert.severity}
                    </span>
                    <span>{alert.type.replace(/_/g, ' ')}</span>
                    <span>·</span>
                    <span>{timeAgo(alert.timestamp)}</span>
                </div>
            </div>
            {!alert.resolved && (
                <button
                    onClick={() => onResolve(alert.alertId)}
                    disabled={resolving}
                    className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-emerald-600 ring-1 ring-emerald-200 transition-all hover:bg-emerald-50 hover:shadow-sm disabled:opacity-50"
                >
                    {resolving ? 'Resolving…' : 'Resolve'}
                </button>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// No Linked Empty State
// ---------------------------------------------------------------------------

function NoLinkedState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl shadow-lg shadow-primary/20">
                🔗
            </div>
            <h2 className="text-2xl font-extrabold text-on-background">No Elderly Linked Yet</h2>
            <p className="mt-2 max-w-md text-sm text-text-muted">
                You haven't linked to your family member yet. Ask your elderly relative for their invite code, then go to your onboarding page to enter it.
            </p>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main Family Dashboard Overview
// ---------------------------------------------------------------------------

export function FamilyDashboard() {
    const { data: profile, isLoading: profileLoading } = useFamilyProfile();
    const elderlyId = profile?.linkedElderlyIds?.[0]; // monitor the first linked elderly

    const { data: vitals, isLoading: vitalsLoading } = useElderlyVitals(elderlyId);
    const { data: risk } = useElderlyRisk(elderlyId);
    const { data: alertsData } = useElderlyAlerts(elderlyId);
    const resolveAlert = useResolveAlert(elderlyId);

    if (profileLoading) {
        return <LoadingState message="Loading your profile…" />;
    }

    if (!elderlyId) {
        return <NoLinkedState />;
    }

    const unresolvedAlerts = alertsData?.alerts.filter(a => !a.resolved) ?? [];

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="animate-fade-in-up flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-on-background">
                        Dashboard Overview
                    </h1>
                    <p className="mt-1 text-sm text-text-muted">
                        A high-level summary of your loved one's wellness statuses
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Live Sync</span>
                </div>
            </div>

            {/* Critical alert banner */}
            {unresolvedAlerts.some(a => a.severity === 'CRITICAL') && (
                <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-red-50 to-red-100/50 p-4 ring-1 ring-red-300 animate-fade-in-up shadow-sm">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 ring-4 ring-red-50">
                        <AlertTriangleIcon size={20} className="shrink-0 text-red-600" />
                    </span>
                    <div>
                        <p className="text-sm font-extrabold text-red-800">
                            Critical Attention Required
                        </p>
                        <p className="text-xs text-red-700/80 font-medium">There are critical alerts that need your immediate action.</p>
                    </div>
                </div>
            )}

            {/* Top Row: Profile & Alerts */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 animate-fade-in-up delay-100">
                {/* Profile Card */}
                <div className="xl:col-span-1">
                    <ElderlyProfileCard elderlyUserId={elderlyId} />
                </div>

                {/* Alerts */}
                <div className="glass-panel glass-card-hover flex flex-col rounded-2xl p-6 xl:col-span-2 h-[350px]">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-extrabold tracking-tight text-on-background">Health Alerts</h2>
                            {unresolvedAlerts.length > 0 && (
                                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                                    {unresolvedAlerts.length}
                                </span>
                            )}
                        </div>
                    </div>
                    {unresolvedAlerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center flex-1 h-full">
                            <CheckCircleIcon size={32} className="mb-3 text-emerald-400 drop-shadow-sm" />
                            <p className="text-sm font-medium text-text-muted">All clear — no active alerts</p>
                        </div>
                    ) : (
                        <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                            {unresolvedAlerts.map(a => (
                                <AlertCard
                                    key={a.alertId}
                                    alert={a}
                                    onResolve={(id) => resolveAlert.mutate({ alertId: id, resolvedBy: profile!.userId })}
                                    resolving={resolveAlert.isPending}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Row: Risk, Vitals */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 animate-fade-in-up delay-200">
                {/* Risk Score */}
                <div className="xl:col-span-1">
                    <RiskScoreCard data={risk} />
                </div>

                {/* Vitals Charts */}
                <div className="xl:col-span-2 flex flex-col md:flex-row gap-4">
                    {vitalsLoading ? (
                        <div className="glass-panel glass-card-hover rounded-2xl p-6 w-full flex justify-center items-center h-[300px]">
                            <LoadingState message="Loading vitals…" />
                        </div>
                    ) : vitals && vitals.items.length > 0 ? (
                        <>
                            <div className="flex-1"><HeartRateChart items={vitals.items} /></div>
                            <div className="flex-1"><BloodPressureChart items={vitals.items} /></div>
                        </>
                    ) : (
                        <div className="glass-panel glass-card-hover w-full flex h-[300px] items-center justify-center rounded-2xl py-16 text-sm text-text-muted">
                            No vitals data available yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
