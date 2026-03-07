import { useFamilyProfile } from '../family.hooks';
import { HealthTimeline } from '../components/HealthTimeline';
import { LoadingState } from '@/shared/components';

export function FamilyTimelinePage() {
    const { data: profile, isLoading } = useFamilyProfile();
    const elderlyId = profile?.linkedElderlyIds?.[0];

    if (isLoading) return <LoadingState message="Loading..." />;
    if (!elderlyId) return null; // Let the dashboard handle NoLinkedState

    return (
        <div className="space-y-6 pb-12 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-on-background">
                    Timeline
                </h1>
                <p className="mt-1 text-sm text-text-muted">
                    A comprehensive history of health events and updates.
                </p>
            </div>

            <div className="max-w-4xl h-[70vh]">
                <HealthTimeline elderlyUserId={elderlyId} />
            </div>
        </div>
    );
}
