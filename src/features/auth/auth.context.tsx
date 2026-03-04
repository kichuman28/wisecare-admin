import {
    createContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { tokenStorage } from '@/lib/auth/token-storage';
import { api } from '@/lib/api/axios-instance';
import { ROUTES } from '@/shared/constants';
import type { TokenPayload } from '@/shared/types';
import type { AuthUser, AuthResponse } from './auth.types';
import { authApi } from './auth.api';

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

export interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: AuthResponse) => void;
    logout: () => Promise<void>;
    /** Update user fields in-place (e.g. after an onboarding step) */
    updateUser: (patch: Partial<AuthUser>) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
    undefined,
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildUserFromResponse(data: AuthResponse): AuthUser {
    return {
        userId: data.userId,
        email: data.email,
        name: data.name,
        role: data.role,
        onboardingStep: data.onboardingStep,
        profileComplete: data.profileComplete,
    };
}

function buildUserFromToken(token: string): AuthUser | null {
    try {
        const decoded = jwtDecode<TokenPayload>(token);
        return {
            userId: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
            // Token doesn't carry these — defaults until /users/me is fetched
            onboardingStep: 'COMPLETE',
            profileComplete: true,
        };
    } catch {
        return null;
    }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // -----------------------------------------------------------------------
    // Restore session on mount
    // -----------------------------------------------------------------------
    useEffect(() => {
        const restoreSession = async () => {
            const accessToken = tokenStorage.getAccessToken();

            if (!accessToken) {
                setIsLoading(false);
                return;
            }

            // Token still valid — decode and restore user
            if (!tokenStorage.isTokenExpired(accessToken)) {
                const restored = buildUserFromToken(accessToken);

                // For FAMILY role, fetch full profile to get real onboardingStep
                if (restored?.role === 'FAMILY') {
                    try {
                        const { data } = await api.get<{ onboardingStep: AuthUser['onboardingStep']; profileComplete: boolean }>('/users/me');
                        restored.onboardingStep = data.onboardingStep;
                        restored.profileComplete = data.profileComplete;
                    } catch {
                        // If profile fetch fails, proceed with defaults
                    }
                }

                setUser(restored);
                setIsLoading(false);
                return;
            }

            // Token expired — try silent refresh
            const refreshToken = tokenStorage.getRefreshToken();
            if (!refreshToken) {
                tokenStorage.clearTokens();
                setIsLoading(false);
                return;
            }

            try {
                const { data } = await authApi.refresh({ refreshToken });
                tokenStorage.setTokens(data.accessToken, data.refreshToken);
                const restored = buildUserFromToken(data.accessToken);

                // For FAMILY role, fetch full profile after refresh
                if (restored?.role === 'FAMILY') {
                    try {
                        const { data: profile } = await api.get<{ onboardingStep: AuthUser['onboardingStep']; profileComplete: boolean }>('/users/me');
                        restored.onboardingStep = profile.onboardingStep;
                        restored.profileComplete = profile.profileComplete;
                    } catch {
                        // If profile fetch fails, proceed with defaults
                    }
                }

                setUser(restored);
            } catch {
                // Refresh failed — force re-login
                tokenStorage.clearTokens();
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();
    }, []);

    // -----------------------------------------------------------------------
    // Login — called after a successful signin/signup mutation
    // -----------------------------------------------------------------------
    const login = useCallback((data: AuthResponse) => {
        tokenStorage.setTokens(data.accessToken, data.refreshToken);
        setUser(buildUserFromResponse(data));
    }, []);

    // -----------------------------------------------------------------------
    // Update user — allows onboarding steps to patch user state
    // -----------------------------------------------------------------------
    const updateUser = useCallback((patch: Partial<AuthUser>) => {
        setUser((prev) => (prev ? { ...prev, ...patch } : null));
    }, []);

    // -----------------------------------------------------------------------
    // Logout
    // -----------------------------------------------------------------------
    const logout = useCallback(async () => {
        const refreshToken = tokenStorage.getRefreshToken();

        // Best-effort signout call — don't block on failure
        if (refreshToken) {
            try {
                await authApi.signOut({ refreshToken });
            } catch {
                // Ignore — we're logging out regardless
            }
        }

        tokenStorage.clearTokens();
        setUser(null);
        queryClient.clear();
        navigate(ROUTES.LOGIN, { replace: true });
    }, [navigate, queryClient]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                isLoading,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
