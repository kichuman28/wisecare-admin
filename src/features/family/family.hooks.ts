import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { familyApi } from './family.api';

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

const familyKeys = {
    profile: ['family', 'profile'] as const,
    vitals: (elderlyUserId: string) => ['family', 'vitals', elderlyUserId] as const,
    risk: (elderlyUserId: string) => ['family', 'risk', elderlyUserId] as const,
    alerts: (elderlyUserId: string) => ['family', 'alerts', elderlyUserId] as const,
    serviceRequests: (elderlyUserId: string) => ['family', 'service-requests', elderlyUserId] as const,
    elderlyProfile: (elderlyUserId: string) => ['family', 'elderly-profile', elderlyUserId] as const,
    medicationSchedule: (elderlyUserId: string, date?: string) => ['family', 'medication-schedule', elderlyUserId, date] as const,
    medicationRefills: (elderlyUserId: string) => ['family', 'medication-refills', elderlyUserId] as const,
    healthTimeline: (elderlyUserId: string, params?: any) => ['family', 'health-timeline', elderlyUserId, params] as const,
    memoryEvents: (elderlyUserId: string, params?: any) => ['family', 'memory-events', elderlyUserId, params] as const,
    wallet: (elderlyUserId: string) => ['family', 'wallet', elderlyUserId] as const,
    walletTransactions: (elderlyUserId: string, params?: any) => ['family', 'wallet-transactions', elderlyUserId, params] as const,
    sosHistory: (elderlyUserId: string) => ['family', 'sos-history', elderlyUserId] as const,
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function useFamilyProfile() {
    return useQuery({
        queryKey: familyKeys.profile,
        queryFn: () => familyApi.getProfile().then(r => {
            const data = r.data as any;
            return (data.user || data) as typeof r.data;
        }),
    });
}

export function useElderlyVitals(elderlyUserId: string | undefined) {
    return useQuery({
        queryKey: familyKeys.vitals(elderlyUserId!),
        queryFn: () => familyApi.getVitals(elderlyUserId!).then(r => r.data),
        enabled: !!elderlyUserId,
    });
}

export function useElderlyRisk(elderlyUserId: string | undefined) {
    return useQuery({
        queryKey: familyKeys.risk(elderlyUserId!),
        queryFn: () => familyApi.getRisk(elderlyUserId!).then(r => r.data),
        enabled: !!elderlyUserId,
    });
}

export function useElderlyAlerts(elderlyUserId: string | undefined) {
    return useQuery({
        queryKey: familyKeys.alerts(elderlyUserId!),
        queryFn: () => familyApi.getAlerts(elderlyUserId!).then(r => r.data),
        enabled: !!elderlyUserId,
    });
}

export function useElderlyServiceRequests(elderlyUserId: string | undefined) {
    return useQuery({
        queryKey: familyKeys.serviceRequests(elderlyUserId!),
        queryFn: () => familyApi.getServiceRequests(elderlyUserId!).then(r => r.data),
        enabled: !!elderlyUserId,
    });
}

export function useElderlyProfileDetails(elderlyUserId: string | undefined) {
    return useQuery({
        queryKey: familyKeys.elderlyProfile(elderlyUserId!),
        queryFn: async () => {
            const r = await familyApi.getElderlyProfile(elderlyUserId!);
            const data = r.data as any;
            const user = data.user || data;

            // The API guide states: "For family users, linked elderly profiles are in: data.user.linkedElderlyProfiles"
            // We need to find the specific elderly profile that matches elderlyUserId
            if (user.linkedElderlyProfiles && Array.isArray(user.linkedElderlyProfiles)) {
                const elderly = user.linkedElderlyProfiles.find((p: any) => p.userId === elderlyUserId);
                if (elderly) return elderly;
            }

            // Fallback if the structure is different or we can't find it
            return user;
        },
        enabled: !!elderlyUserId,
    });
}

export function useMedicationSchedule(elderlyUserId: string | undefined, date?: string) {
    return useQuery({
        queryKey: familyKeys.medicationSchedule(elderlyUserId!, date),
        queryFn: () => familyApi.getMedicationSchedule(elderlyUserId!, date).then(r => r.data),
        enabled: !!elderlyUserId,
    });
}

// Note: useMedicationRefills hook removed since the endpoint is POST-only.

// Timeline and Memory Events hooks were removed as the underlying API endpoints do not exist.

export function useWallet(elderlyUserId: string | undefined) {
    return useQuery({
        queryKey: familyKeys.wallet(elderlyUserId!),
        queryFn: () => familyApi.getWallet(elderlyUserId!).then(r => r.data),
        enabled: !!elderlyUserId,
    });
}

export function useWalletTransactions(elderlyUserId: string | undefined, params?: { limit?: number; startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: familyKeys.walletTransactions(elderlyUserId!, params),
        queryFn: () => familyApi.getWalletTransactions(elderlyUserId!, params).then(r => r.data),
        enabled: !!elderlyUserId,
    });
}

export function useSosHistory(elderlyUserId: string | undefined) {
    return useQuery({
        queryKey: familyKeys.sosHistory(elderlyUserId!),
        queryFn: () => familyApi.getSosHistory(elderlyUserId!).then(r => r.data),
        enabled: !!elderlyUserId,
    });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function useResolveAlert(elderlyUserId: string | undefined) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ alertId, resolvedBy }: { alertId: string; resolvedBy: string }) =>
            familyApi.resolveAlert(alertId, resolvedBy),
        onSuccess: () => {
            if (elderlyUserId) {
                qc.invalidateQueries({ queryKey: familyKeys.alerts(elderlyUserId) });
            }
        },
    });
}

export function useTopUpWallet(elderlyUserId: string | undefined) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ amount, paymentMethod, notes }: { amount: number; paymentMethod?: string; notes?: string }) =>
            familyApi.topUpWallet(elderlyUserId!, amount, paymentMethod, notes),
        onSuccess: () => {
            if (elderlyUserId) {
                qc.invalidateQueries({ queryKey: familyKeys.wallet(elderlyUserId) });
                qc.invalidateQueries({ queryKey: familyKeys.walletTransactions(elderlyUserId, undefined) });
            }
        },
    });
}
