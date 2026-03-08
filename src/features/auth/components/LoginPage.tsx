import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useAuth } from '../use-auth';
import { authApi } from '../auth.api';
import { getDashboardRoute, getOnboardingRoute, ROUTES } from '@/shared/constants';
import type { AuthResponse } from '../auth.types';
import type { ApiError } from '@/shared/types';
import loginImage from '@/assets/login_image.png';
import textLogo from '@/assets/wisecare_text_logo.png';

/**
 * Determines where to navigate after a successful login.
 * FAMILY users mid-onboarding are sent to their current step.
 */
function getPostLoginRoute(data: AuthResponse): string {
    if (data.role === 'FAMILY' && data.onboardingStep !== 'COMPLETE') {
        return getOnboardingRoute(data.onboardingStep);
    }
    return getDashboardRoute(data.role);
}

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const signinMutation = useMutation<
        { data: AuthResponse },
        AxiosError<ApiError>,
        { email: string; password: string }
    >({
        mutationFn: (credentials) => authApi.signIn(credentials),
        onSuccess: ({ data }) => {
            login(data);
            navigate(getPostLoginRoute(data), { replace: true });
        },
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;
        signinMutation.mutate({ email: email.trim(), password });
    };

    const errorMessage =
        signinMutation.error?.response?.data?.message ??
        (signinMutation.isError ? 'Something went wrong. Please try again.' : null);

    return (
        <div className="flex min-h-screen">
            {/* ──── Left Hero Panel (60%) ──── */}
            <div className="relative hidden w-[60%] overflow-hidden bg-navy lg:block">
                <img
                    src={loginImage}
                    alt="WiseCare Illustration"
                    className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-1000"
                />

                {/* Gradient overlay to ensure text contrast at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy/20 to-transparent"></div>

                {/* Bottom attribution */}
                <div className="absolute bottom-8 left-0 right-0 text-center z-10">
                    <p className="text-xs text-white/70 tracking-wide font-medium drop-shadow-md">
                        © 2026 WiseCare — Care, Simplified.
                    </p>
                </div>
            </div>

            {/* ──── Right Login Panel (40%) ──── */}
            <div className="relative flex w-full flex-col justify-center bg-warm-bg px-6 py-24 lg:w-[40%] lg:px-16 lg:py-0">
                {/* Top Logo */}
                <div className="absolute top-10 left-0 right-0 flex justify-center lg:top-16">
                    <img src={textLogo} alt="WiseCare Logo" className="h-8 lg:h-10 object-contain drop-shadow-sm" />
                </div>

                <div className="mx-auto w-full max-w-sm">
                    <h2 className="mb-1 text-2xl font-bold text-on-background">
                        Welcome back
                    </h2>
                    <p className="mb-8 text-sm text-text-muted">
                        Sign in to access your dashboard
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errorMessage && (
                            <div className="rounded-lg bg-error-light px-4 py-3 text-sm text-error">
                                {errorMessage}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-medium text-on-background"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-xl border border-outline bg-card-surface px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-medium text-on-background"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-xl border border-outline bg-card-surface px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={signinMutation.isPending}
                            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {signinMutation.isPending ? 'Signing in…' : 'Sign in'}
                        </button>

                        <div className="pt-6 border-t border-outline/50 mt-4 text-center">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted mb-3">Demo Accounts</p>
                            <div className="flex gap-2 justify-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmail('admin@wisecare.com');
                                        setPassword('AdminPassword123!');
                                    }}
                                    className="px-3 py-1.5 rounded-lg border border-outline bg-white text-xs font-semibold text-on-background hover:bg-surface transition-colors"
                                >
                                    Admin Demo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmail('jam@gmail.com');
                                        setPassword('123456');
                                    }}
                                    className="px-3 py-1.5 rounded-lg border border-outline bg-white text-xs font-semibold text-on-background hover:bg-surface transition-colors"
                                >
                                    Family Demo
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


