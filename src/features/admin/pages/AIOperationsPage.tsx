import { useState } from 'react';
import { useDailySummary, useWeeklySummary, useRecommendations, useAnomalies } from '../admin.hooks';
import { LoadingState, ActivityIcon, AlertTriangleIcon, CheckCircleIcon, CustomDatePicker } from '@/shared/components';
import type { DailyStatus, Recommendation, Anomaly } from '../admin.types';

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

const STATUS_STYLE: Record<DailyStatus, string> = {
    EXCELLENT: 'bg-green-100 text-green-700',
    GOOD: 'bg-blue-100 text-blue-700',
    NEEDS_ATTENTION: 'bg-amber-100 text-amber-700',
    CRITICAL: 'bg-red-100 text-red-700',
};

// ---------------------------------------------------------------------------
// Small metric card
// ---------------------------------------------------------------------------

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
    return (
        <div className="rounded-lg border border-outline bg-card-surface p-3">
            <p className="text-xs text-text-muted">{label}</p>
            <p className="mt-0.5 text-xl font-bold text-on-background">{value}</p>
            {sub && <p className="text-[10px] text-text-muted">{sub}</p>}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Recommendation card
// ---------------------------------------------------------------------------

function RecommendationCard({ rec }: { rec: Recommendation }) {
    const colors: Record<string, string> = {
        HIGH: 'border-l-red-500',
        MEDIUM: 'border-l-amber-500',
        LOW: 'border-l-blue-500',
    };

    return (
        <div className={`rounded-xl border border-l-4 border-outline bg-card-surface p-4 ${colors[rec.priority] ?? colors.LOW}`}>
            <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${rec.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                    rec.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                    }`}>{rec.priority}</span>
                <span className="text-xs text-text-muted">{rec.type}</span>
            </div>
            <h4 className="mt-2 text-sm font-semibold text-on-background">{rec.title}</h4>
            <p className="mt-1 text-xs text-text-muted">{rec.description}</p>
            <p className="mt-2 text-xs font-medium text-primary">Action: {rec.action}</p>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Anomaly card
// ---------------------------------------------------------------------------

function AnomalyCard({ anomaly }: { anomaly: Anomaly }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-outline bg-card-surface p-4">
            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${anomaly.severity === 'CRITICAL' ? 'bg-red-100' :
                anomaly.severity === 'HIGH' ? 'bg-orange-100' :
                    'bg-amber-100'
                }`}>
                <AlertTriangleIcon size={16} className={
                    anomaly.severity === 'CRITICAL' ? 'text-red-500' :
                        anomaly.severity === 'HIGH' ? 'text-orange-500' :
                            'text-amber-500'
                } />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-on-background">{anomaly.message}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${anomaly.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        anomaly.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                            'bg-amber-100 text-amber-700'
                        }`}>{anomaly.severity}</span>
                    {anomaly.metadata && (
                        <>
                            <span>Metric: {anomaly.metadata.metric}</span>
                            <span>Threshold: {anomaly.metadata.threshold} → Actual: {anomaly.metadata.actual}</span>
                        </>
                    )}
                </div>
                {anomaly.metadata?.recommendation && (
                    <p className="mt-1 text-xs text-primary">{anomaly.metadata.recommendation}</p>
                )}
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${anomaly.resolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {anomaly.resolved ? 'Resolved' : 'Active'}
            </span>
        </div>
    );
}

// ---------------------------------------------------------------------------
// AIOperationsPage
// ---------------------------------------------------------------------------

export function AIOperationsPage() {
    const [summaryDate, setSummaryDate] = useState('');
    const { data: daily, isLoading: loadingDaily } = useDailySummary(summaryDate || undefined);
    const { data: weekly, isLoading: loadingWeekly } = useWeeklySummary();
    const { data: recs, isLoading: loadingRecs } = useRecommendations();
    const { data: anomalies, isLoading: loadingAnomalies } = useAnomalies();

    // Safe-access helpers for potentially missing nested fields
    const recsList = recs?.recommendations ?? [];
    const anomalyList = anomalies?.anomalies ?? [];
    const dailySummaries = weekly?.dailySummaries ?? [];
    const weeklyTotals = weekly?.weeklyTotals;
    const metrics = daily?.metrics;
    const byCategory = daily?.byCategory ?? {};
    const needsAttention = daily?.needsAttention;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-gradient-bottom">
                    <ActivityIcon size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-on-background">AI Operations</h1>
                    <p className="text-sm text-text-muted">Daily summaries, performance metrics, and AI recommendations.</p>
                </div>
            </div>

            {/* ── Daily Summary ── */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-on-background">Daily Summary</h2>
                    <CustomDatePicker
                        value={summaryDate}
                        onChange={setSummaryDate}
                    />
                </div>

                {loadingDaily && <LoadingState message="Loading daily summary…" />}

                {daily && (
                    <div className="space-y-4">
                        {/* Status + summary text */}
                        <div className="flex items-start gap-4 rounded-xl border border-outline bg-card-surface p-5">
                            {daily.status && (
                                <span className={`rounded-lg px-3 py-1 text-sm font-bold ${STATUS_STYLE[daily.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                    {daily.statusEmoji ?? ''} {daily.status.replace(/_/g, ' ')}
                                </span>
                            )}
                            <p className="text-sm leading-relaxed text-on-background">{daily.summaryText ?? ''}</p>
                        </div>

                        {/* Metrics grid */}
                        {metrics && (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                                <MetricCard label="Total Tasks" value={metrics.totalTasks ?? 0} />
                                <MetricCard label="AI Completed" value={metrics.aiCompleted ?? 0} sub={`${(metrics.aiSuccessRate ?? 0).toFixed(1)}% success`} />
                                <MetricCard label="Human Completed" value={metrics.humanCompleted ?? 0} />
                                <MetricCard label="AI Escalated" value={metrics.aiEscalated ?? 0} />
                                <MetricCard label="Total Cost" value={`$${(metrics.totalCost ?? 0).toFixed(2)}`} />
                                <MetricCard label="Avg Time" value={`${(metrics.avgExecutionTime ?? 0).toFixed(1)}s`} />
                            </div>
                        )}

                        {/* Category breakdown */}
                        {Object.keys(byCategory).length > 0 && (
                            <div className="rounded-xl border border-outline bg-card-surface p-4">
                                <h3 className="mb-3 text-sm font-semibold text-on-background">Category Breakdown</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-outline text-left text-xs text-text-muted">
                                                <th className="pb-2 font-medium">Category</th>
                                                <th className="pb-2 text-center font-medium">Total</th>
                                                <th className="pb-2 text-center font-medium">Completed</th>
                                                <th className="pb-2 text-center font-medium">Escalated</th>
                                                <th className="pb-2 text-center font-medium">Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(byCategory).map(([cat, d]) => (
                                                <tr key={cat} className="border-b border-outline/50">
                                                    <td className="py-2 font-medium text-on-background">{cat}</td>
                                                    <td className="py-2 text-center">{d?.total ?? 0}</td>
                                                    <td className="py-2 text-center text-green-600">{d?.completed ?? 0}</td>
                                                    <td className="py-2 text-center text-amber-600">{d?.escalated ?? 0}</td>
                                                    <td className="py-2 text-center">
                                                        {(d?.total ?? 0) > 0 ? (((d?.completed ?? 0) / (d?.total ?? 1)) * 100).toFixed(0) : 0}%
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Needs attention */}
                        {needsAttention && ((needsAttention.escalations ?? 0) > 0 || (needsAttention.criticalAlerts ?? 0) > 0) && (
                            <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                                <AlertTriangleIcon size={18} />
                                <span>
                                    {needsAttention.escalations ?? 0} escalations, {needsAttention.criticalAlerts ?? 0} critical alerts need attention.
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* ── Weekly Overview ── */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-on-background">Weekly Overview</h2>
                {loadingWeekly && <LoadingState message="Loading weekly data…" />}
                {weekly && (
                    <div className="rounded-xl border border-outline bg-card-surface p-5">
                        <div className="mb-4 flex flex-wrap gap-6">
                            <div>
                                <p className="text-xs text-text-muted">Period</p>
                                <p className="text-sm font-medium text-on-background">{weekly.startDate ?? '—'} → {weekly.endDate ?? '—'}</p>
                            </div>
                            {weeklyTotals && (
                                <>
                                    <div>
                                        <p className="text-xs text-text-muted">Total Tasks</p>
                                        <p className="text-xl font-bold text-on-background">{weeklyTotals.totalTasks ?? 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-muted">Avg Success Rate</p>
                                        <p className="text-xl font-bold text-primary">{(weeklyTotals.avgSuccessRate ?? 0).toFixed(1)}%</p>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* Mini bar chart */}
                        {dailySummaries.length > 0 && (
                            <div className="flex items-end gap-1">
                                {dailySummaries.map((d) => {
                                    const max = Math.max(...dailySummaries.map((s) => s.tasks ?? 0), 1);
                                    const height = Math.max(((d.tasks ?? 0) / max) * 80, 4);
                                    return (
                                        <div key={d.date} className="flex-1 text-center" title={`${d.date}: ${d.tasks ?? 0} tasks`}>
                                            <div className="mx-auto mb-1 rounded-t bg-primary/80 transition-all hover:bg-primary"
                                                style={{ height: `${height}px` }} />
                                            <p className="text-[9px] text-text-muted">{(d.date ?? '').slice(5)}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* ── Recommendations ── */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-on-background">AI Recommendations</h2>
                {loadingRecs && <LoadingState message="Loading recommendations…" />}
                {recs && recsList.length === 0 && (
                    <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        <CheckCircleIcon size={18} /> All systems performing well — no recommendations.
                    </div>
                )}
                {recsList.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {recsList.map((r, i) => (
                            <RecommendationCard key={i} rec={r} />
                        ))}
                    </div>
                )}
            </section>

            {/* ── Anomalies ── */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-on-background">System Anomalies</h2>
                {loadingAnomalies && <LoadingState message="Checking for anomalies…" />}
                {anomalies && anomalyList.length === 0 && (
                    <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        <CheckCircleIcon size={18} /> No anomalies detected in the last {anomalies.period ?? '24h'}.
                    </div>
                )}
                {anomalyList.length > 0 && (
                    <div className="space-y-3">
                        {anomalyList.map((a) => (
                            <AnomalyCard key={a.alertId} anomaly={a} />
                        ))}
                    </div>
                )}
            </section>
        </div >
    );
}
