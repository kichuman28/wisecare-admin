import type { OnboardingStep } from '@/shared/types';

// ---------------------------------------------------------------------------
// Family-specific types
// ---------------------------------------------------------------------------

/** Relationship values accepted by POST /onboarding/family/basic */
export type FamilyRelationship =
    | 'Son'
    | 'Daughter'
    | 'Spouse'
    | 'Sibling'
    | 'Other';

// ---------------------------------------------------------------------------
// Request shapes
// ---------------------------------------------------------------------------

export interface FamilyBasicRequest {
    relationship: FamilyRelationship;
    city: string;
    phone: string;
}

export interface FamilyLinkRequest {
    inviteCode: string;
}

// ---------------------------------------------------------------------------
// Response shapes
// ---------------------------------------------------------------------------

export interface FamilyBasicResponse {
    message: string;
    onboardingStep: OnboardingStep;
}

export interface FamilyLinkResponse {
    message: string;
    elderlyUserId: string;
    elderlyName: string;
    elderlyCity: string;
}

/** Subset of /users/me relevant to family context */
export interface FamilyProfile {
    userId: string;
    email: string;
    name: string;
    role: 'FAMILY';
    phone: string;
    city: string;
    onboardingStep: OnboardingStep;
    profileComplete: boolean;
    linkedElderlyIds: string[];
}
