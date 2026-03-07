import { api } from '@/lib/api/axios-instance';
import type {
    FamilyBasicRequest,
    FamilyBasicResponse,
    FamilyLinkRequest,
    FamilyLinkResponse,
    FamilyProfile,
    VitalsResponse,
    RiskResponse,
    ElderlyAlertsResponse,
    ElderlyServiceRequestsResponse,
    MedicationScheduleResponse,
    Wallet,
    WalletTransactionsResponse,
    WalletTopupResponse,
    SosHistoryResponse,
} from './family.types';

// ---------------------------------------------------------------------------
// Family API calls
// ---------------------------------------------------------------------------

export const familyApi = {
    /** Save basic family info (relationship, city, phone) */
    submitBasicInfo(data: FamilyBasicRequest) {
        return api.post<FamilyBasicResponse>('/onboarding/family/basic', data);
    },

    /** Link family member to elderly user via invite code */
    linkWithInviteCode(data: FamilyLinkRequest) {
        return api.post<FamilyLinkResponse>('/onboarding/family/link', data);
    },

    /** Fetch the current user's full profile */
    getProfile() {
        return api.get<FamilyProfile>('/users/me');
    },

    // -----------------------------------------------------------------------
    // Dashboard monitoring APIs
    // -----------------------------------------------------------------------

    /** Last 10 vital readings for a linked elderly user */
    getVitals(elderlyUserId: string) {
        return api.get<VitalsResponse>(`/vitals/latest/${elderlyUserId}`);
    },

    /** Current risk score for a linked elderly user */
    getRisk(elderlyUserId: string) {
        return api.get<RiskResponse>(`/risk/${elderlyUserId}`);
    },

    /** Unresolved alerts for a linked elderly user */
    getAlerts(elderlyUserId: string) {
        return api.get<ElderlyAlertsResponse>(`/alerts/user/${elderlyUserId}`);
    },

    /** Resolve an alert */
    resolveAlert(alertId: string, resolvedBy: string) {
        return api.patch(`/alerts/${alertId}/resolve`, { resolvedBy });
    },

    /** Service requests for a linked elderly user (read-only) */
    getServiceRequests(elderlyUserId: string) {
        return api.get<ElderlyServiceRequestsResponse>('/service-requests', {
            params: { elderlyUserId },
        });
    },

    // -----------------------------------------------------------------------
    // New APIs for Family Dashboard Expanded Features
    // ---------------------------------------------------------------------------

    getElderlyProfile(_elderlyUserId?: string) {
        // As per guide, family users still hit /users/me to get linked profiles, 
        // but here we might just need to fetch the main profile. We will just use /users/me since /users/{userId} does not exist.
        // Wait, the guide says: "For family viewing elderly user: GET /users/me  // Still use /users/me, not /users/{userId}"
        // But what if they need specific details? The backend returns linked elderly profiles in the response.
        // Let's just point to /users/me for now, and the component might need to extract the specific elderly profile.
        // Actually, the guide says "For family users, linked elderly profiles are in: data.user.linkedElderlyProfiles"
        // Let's adjust this to just call /users/me and we'll fix the hook/component if needed.
        return api.get<any>(`/users/me`);
    },

    getMedicationSchedule(_elderlyUserId?: string, date?: string) {
        // As per guide, Family viewing elderly user's schedule is not directly supported yet via a simple parameter.
        // The guide says: "Currently not supported - use /users/me to get linked elderly profiles. Then call /meds/schedule with elderly user's token"
        // This is tricky for the frontend SDK to handle automatically without managing multiple tokens.
        // However, we MUST remove the path parameter to avoid 404s. Let's just call /meds/schedule for now.
        // Some backends might accept ?userId= even if undocumented, but let's stick to the guide.
        return api.get<MedicationScheduleResponse>(`/meds/schedule`, {
            params: date ? { date } : undefined,
        });
    },

    // Note: getMedicationRefills endpoint does not exist for GET requests. Only POST allowed for Refill Creation by elderly users.

    // Note: getHealthTimeline and getMemoryEvents have been removed since those endpoints do not exist on the backend API.

    getWallet(elderlyUserId: string) {
        return api.get<Wallet>('/wallet/balance', {
            params: { userId: elderlyUserId }
        });
    },

    getWalletTransactions(elderlyUserId: string, params?: { limit?: number; startDate?: string; endDate?: string }) {
        return api.get<WalletTransactionsResponse>('/wallet/transactions', {
            params: { userId: elderlyUserId, ...params }
        });
    },

    topUpWallet(elderlyUserId: string, amount: number, paymentMethod: string = 'UPI', notes?: string) {
        return api.post<WalletTopupResponse>('/wallet/topup', {
            userId: elderlyUserId,
            amount,
            paymentMethod,
            notes
        });
    },

    getSosHistory(elderlyUserId: string) {
        return api.get<SosHistoryResponse>('/sos', {
            params: { userId: elderlyUserId }
        });
    },
} as const;
