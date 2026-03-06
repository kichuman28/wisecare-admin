import { useUserDetail } from '../admin.hooks';
import { LoadingState } from '@/shared/components';

interface UserDetailDrawerProps {
    userId: string;
    onClose: () => void;
}

export function UserDetailDrawer({ userId, onClose }: UserDetailDrawerProps) {
    const { data: user, isLoading } = useUserDetail(userId);

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px]" onClick={onClose}>
            <div className="h-full w-full max-w-md animate-[slideInRight_300ms_ease-out] overflow-y-auto bg-card-surface shadow-2xl"
                onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-outline bg-card-surface px-6 py-4">
                    <h2 className="text-lg font-bold text-on-background">User Profile</h2>
                    <button type="button" onClick={onClose}
                        className="rounded-lg p-1.5 text-text-muted hover:bg-warm-bg hover:text-on-background">✕</button>
                </div>

                {isLoading && <LoadingState message="Loading profile…" />}

                {user && (
                    <div className="space-y-6 px-6 py-5">
                        {/* Avatar & name */}
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-navy to-icon-shield text-lg font-bold text-white">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-lg font-bold text-on-background">{user.name}</p>
                                <p className="text-sm text-text-muted">{user.email}</p>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${user.role === 'ELDERLY' ? 'bg-blue-100 text-blue-700' :
                                            user.role === 'FAMILY' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'AGENT' ? 'bg-emerald-100 text-emerald-700' :
                                                    'bg-navy/10 text-navy'
                                        }`}>{user.role}</span>
                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>{user.active ? 'Active' : 'Inactive'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Info grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <InfoItem label="Phone" value={user.phone} />
                            <InfoItem label="City" value={user.city} />
                            {user.age && <InfoItem label="Age" value={String(user.age)} />}
                            {user.address && <InfoItem label="Address" value={user.address} />}
                            <InfoItem label="Joined" value={new Date(user.createdAt).toLocaleDateString('en-IN')} />
                            <InfoItem label="Onboarding" value={user.onboardingStep ?? '—'} />
                        </div>

                        {/* Pre-existing conditions (elderly) */}
                        {user.preExistingConditions && user.preExistingConditions.length > 0 && (
                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Pre-existing Conditions</p>
                                <div className="flex flex-wrap gap-2">
                                    {user.preExistingConditions.map((c) => (
                                        <span key={c} className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">{c}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Medications (elderly) */}
                        {user.medications && user.medications.length > 0 && (
                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Medications</p>
                                <div className="space-y-2">
                                    {user.medications.map((m) => (
                                        <div key={m.name} className="flex items-center justify-between rounded-lg bg-warm-bg px-3 py-2">
                                            <span className="text-sm font-medium text-on-background">{m.name}</span>
                                            <span className="text-xs text-text-muted">{m.dosage}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Memory summary (elderly — from Arya) */}
                        {user.memorySummary && (
                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Arya's Memory Summary</p>
                                <div className="rounded-lg border border-outline bg-warm-bg p-4 text-sm leading-relaxed text-on-background">
                                    {user.memorySummary}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value?: string }) {
    return (
        <div>
            <p className="text-xs text-text-muted">{label}</p>
            <p className="text-sm font-medium text-on-background">{value || '—'}</p>
        </div>
    );
}
