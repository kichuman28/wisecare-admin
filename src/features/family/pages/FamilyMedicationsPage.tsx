import { useFamilyProfile } from '../family.hooks';
import { MedicationsTracker } from '../components/MedicationsTracker';
import { LoadingState } from '@/shared/components';

export function FamilyMedicationsPage() {
    const { data: profile, isLoading } = useFamilyProfile();
    const elderlyId = profile?.linkedElderlyIds?.[0];

    if (isLoading) return <LoadingState message="Loading..." />;
    if (!elderlyId) return null;

    return (
        <div className="space-y-6 pb-12 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-on-background">
                    Medications
                </h1>
                <p className="mt-1 text-sm text-text-muted">
                    Track daily schedules and manage pharmacy refills.
                </p>
            </div>

            <div className="max-w-2xl h-[70vh]">
                <MedicationsTracker elderlyUserId={elderlyId} />
            </div>
        </div>
    );
}
