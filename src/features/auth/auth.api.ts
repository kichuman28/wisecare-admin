import { api } from '@/lib/api/axios-instance';
import type {
    LoginRequest,
    SignupRequest,
    SignoutRequest,
    RefreshRequest,
    RefreshResponse,
    AuthResponse,
} from './auth.types';

// ---------------------------------------------------------------------------
// Auth API calls
// ---------------------------------------------------------------------------

export const authApi = {
    signIn(data: LoginRequest) {
        return api.post<AuthResponse>('/auth/signin', data);
    },

    signUp(data: SignupRequest) {
        return api.post<AuthResponse>('/auth/signup', data);
    },

    signOut(data: SignoutRequest) {
        return api.post<{ message: string }>('/auth/signout', data);
    },

    refresh(data: RefreshRequest) {
        return api.post<RefreshResponse>('/auth/refresh', data);
    },
} as const;
