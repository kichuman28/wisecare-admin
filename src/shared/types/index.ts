/** Platform user roles */
export type UserRole = 'ELDERLY' | 'FAMILY' | 'AGENT' | 'ADMIN';

/** Onboarding step values returned by the backend */
export type OnboardingStep =
    | 'BASIC_INFO'
    | 'MEDICATIONS'
    | 'INVITE'
    | 'LINK'
    | 'COMPLETE';

/** JWT access-token payload shape (decoded from accessToken) */
export interface TokenPayload {
    sub: string;
    email: string;
    name: string;
    role: UserRole;
    exp: number;
    iat: number;
}

/** Shape returned by POST /auth/signin and POST /auth/signup */
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    userId: string;
    role: UserRole;
    name: string;
    email: string;
    onboardingStep: OnboardingStep;
    profileComplete: boolean;
    city?: string;
    inviteCode?: string;
}

/** Generic API error response shape */
export interface ApiError {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
}
