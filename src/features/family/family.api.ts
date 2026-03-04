import { api } from '@/lib/api/axios-instance';
import type {
    FamilyBasicRequest,
    FamilyBasicResponse,
    FamilyLinkRequest,
    FamilyLinkResponse,
    FamilyProfile,
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
} as const;
