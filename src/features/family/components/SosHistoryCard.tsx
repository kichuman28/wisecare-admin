import { useSosHistory } from '../family.hooks';
import { LoadingState } from '@/shared/components';
import { AlertCriticalIcon } from '@/shared/components/Icons';

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

export function SosHistoryCard({ elderlyUserId }: { elderlyUserId: string }) {
    const { data: sosData, isLoading } = useSosHistory(elderlyUserId);

    if (isLoading) {
        return (
            <div className="glass-panel glass-card-hover flex min-h-[200px] flex-col items-center justify-center rounded-2xl p-6 relative overflow-hidden">
                <LoadingState message="Loading SOS history..." />
            </div>
        );
    }

    const events = sosData?.sosEvents || [];

    return (
        <div className="glass-panel glass-card-hover flex flex-col rounded-2xl p-6 h-full relative overflow-hidden bg-white/40">
            {/* Background warning tint */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-red-50 to-white -z-10 opacity-50"></div>

            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-extrabold tracking-tight text-on-background flex items-center gap-2">
                    <span className="text-red-600"><AlertCriticalIcon size={20} /></span>
                    SOS History
                </h2>
                {events.length > 0 && (
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                        {events.length} Events
                    </span>
                )}
            </div>

            {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-text-muted">
                    <span className="mb-2 text-3xl">🛡️</span>
                    <p className="text-sm font-medium">No SOS events recorded.</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {events.map((sos) => (
                        <div key={sos.sosId} className="flex flex-col gap-1 rounded-xl bg-red-50 p-3 ring-1 ring-red-100 transition-all hover:bg-red-100/50">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-red-900">Emergency SOS Triggered</p>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600/70">{timeAgo(sos.timestamp)}</span>
                            </div>
                            <div className="text-xs text-red-800/80 mt-1 flex items-start gap-1.5">
                                <span className="pt-0.5">📍</span>
                                <span>Location ID: {sos.location?.latitude?.toFixed(4) ?? '—'}, {sos.location?.longitude?.toFixed(4) ?? '—'}</span>
                            </div>
                            {sos.resolvedAt && (
                                <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 w-fit px-2 py-0.5 rounded-md">
                                    Resolved
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
