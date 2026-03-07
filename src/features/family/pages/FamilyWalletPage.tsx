import { useFamilyProfile } from '../family.hooks';
import { WalletWidget } from '../components/WalletWidget';
import { LoadingState } from '@/shared/components';

export function FamilyWalletPage() {
    const { data: profile, isLoading } = useFamilyProfile();
    const elderlyId = profile?.linkedElderlyIds?.[0];

    if (isLoading) return <LoadingState message="Loading..." />;
    if (!elderlyId) return null;

    return (
        <div className="space-y-6 pb-12 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-on-background">
                    Wallet & Transactions
                </h1>
                <p className="mt-1 text-sm text-text-muted">
                    Manage service allowances and review recent spending.
                </p>
            </div>

            <div className="max-w-xl h-[70vh]">
                <WalletWidget elderlyUserId={elderlyId} />
            </div>
        </div>
    );
}
