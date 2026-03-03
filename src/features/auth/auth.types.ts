import type { AuthResponse, UserRole, OnboardingStep } from '@/shared/types';

// ---------------------------------------------------------------------------
// Request shapes
// ---------------------------------------------------------------------------

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    phone: string;
    city: string;
}

export interface SignoutRequest {
    refreshToken: string;
}

export interface RefreshRequest {
    refreshToken: string;
}

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
    userId: string;
    role: UserRole;
    name: string;
}

// ---------------------------------------------------------------------------
// Auth user — the subset of data we keep in context after login
// ---------------------------------------------------------------------------

export interface AuthUser {
    userId: string;
    email: string;
    name: string;
    role: UserRole;
    onboardingStep: OnboardingStep;
    profileComplete: boolean;
}

// Re-export for convenience
export type { AuthResponse };
