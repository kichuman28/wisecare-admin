import { useMedicationSchedule } from '../family.hooks';
import { LoadingState, CheckCircleIcon } from '@/shared/components';

export function MedicationsTracker({ elderlyUserId }: { elderlyUserId: string }) {
    const { data: schedule, isLoading: scheduleLoading } = useMedicationSchedule(elderlyUserId);

    if (scheduleLoading) {
        return (
            <div className="glass-panel glass-card-hover flex min-h-[250px] items-center justify-center rounded-2xl p-6">
                <LoadingState message="Loading medications..." />
            </div>
        );
    }

    const meds = schedule?.medications || [];

    return (
        <div className="glass-panel glass-card-hover flex flex-col rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold tracking-tight text-on-background">Medications</h2>
                    {meds.some(m => !m.taken) && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                            {meds.filter(m => !m.taken).length} pending
                        </span>
                    )}
                </div>
            </div>

            {meds.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <span className="mb-2 text-3xl">💊</span>
                    <p className="text-sm font-medium text-text-muted">No medications scheduled for today</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Today's Schedule</h3>
                    <div className="max-h-[200px] space-y-2 overflow-y-auto pr-2">
                        {meds.map(med => (
                            <div key={med.medicationId} className={`flex items-center gap-3 rounded-xl p-3 ring-1 transition-all ${med.taken ? 'bg-emerald-50/50 ring-emerald-100' : 'bg-primary/5 ring-primary/10'}`}>
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${med.taken ? 'bg-emerald-100 text-emerald-600' : 'bg-white shadow-sm'}`}>
                                    {med.taken ? <CheckCircleIcon size={20} /> : '🕒'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className={`truncate text-sm font-bold ${med.taken ? 'text-emerald-900 line-through opacity-70' : 'text-on-background'}`}>
                                        {med.name} {med.dosage}
                                    </p>
                                    <p className="text-xs text-text-muted">
                                        {med.scheduledTime} · {med.notes || med.frequency}
                                    </p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${med.taken ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {med.taken ? 'Taken' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
