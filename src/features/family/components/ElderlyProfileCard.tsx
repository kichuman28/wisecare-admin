import { useElderlyProfileDetails } from '../family.hooks';
import { LoadingState } from '@/shared/components';

export function ElderlyProfileCard({ elderlyUserId }: { elderlyUserId: string }) {
    const { data: profile, isLoading } = useElderlyProfileDetails(elderlyUserId);

    if (isLoading) {
        return (
            <div className="glass-panel glass-card-hover flex min-h-[200px] items-center justify-center rounded-2xl p-6">
                <LoadingState message="Loading profile..." />
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="glass-panel glass-card-hover relative flex h-full flex-col overflow-hidden rounded-2xl p-6">
            {/* Background design element */}
            <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-bl-[100px] bg-primary/5 blur-xl"></div>

            <div className="mb-6 flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-2xl text-white shadow-lg shadow-primary/20">
                    {(profile?.name && typeof profile.name === 'string') ? profile.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-xl font-extrabold text-on-background">{profile?.name || 'Unknown User'}</h2>
                    <p className="mt-0.5 text-sm text-text-muted">{profile?.age || '--'} years old · {profile?.city || 'Unknown Local'}</p>
                    <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                        ID: {(profile?.userId && typeof profile.userId === 'string') ? profile.userId.split('-')[0] : 'Unknown'}
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-4">
                <div>
                    <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-text-muted">Contact</h3>
                    <p className="flex items-center gap-2 text-sm font-medium text-on-background">
                        <span className="text-primary/70">📱</span> {profile.phone}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-on-background">
                        <span className="text-primary/70">📍</span> {profile.address}
                    </p>
                </div>

                {profile.emergencyContact && (
                    <div className="mt-auto border-t border-outline/50 pt-4">
                        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">Emergency Contact</h3>
                        <div className="rounded-xl border border-red-100 bg-red-50/50 p-3">
                            <p className="text-sm font-bold text-red-900">{profile.emergencyContact.name}</p>
                            <p className="mt-0.5 text-xs text-red-700">{profile.emergencyContact.relation} · {profile.emergencyContact.phone}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
