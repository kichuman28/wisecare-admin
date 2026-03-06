import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useAuth } from '../use-auth';
import { authApi } from '../auth.api';
import { getDashboardRoute, getOnboardingRoute, ROUTES } from '@/shared/constants';
import type { AuthResponse } from '../auth.types';
import type { ApiError } from '@/shared/types';

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
            <div className="relative hidden w-[60%] overflow-hidden bg-gradient-to-br from-gradient-top via-navy to-gradient-bottom lg:flex lg:flex-col lg:items-center lg:justify-center">
                {/* Decorative circles */}
                <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-accent-blue/10 blur-3xl" />
                <div className="absolute right-10 top-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />

                {/* Content */}
                <div className="relative z-10 max-w-md px-12 text-center">
                    {/* Logo */}
                    <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-icon-shield/80 shadow-2xl backdrop-blur-sm">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 4C14.5 4 10 8 10 13C10 16 11.5 18.5 14 20L12 32H28L26 20C28.5 18.5 30 16 30 13C30 8 25.5 4 20 4Z" fill="#FF6933" opacity="0.9" />
                            <path d="M20 8C16.7 8 14 10.7 14 14C14 17.3 16.7 20 20 20C23.3 20 26 17.3 26 14C26 10.7 23.3 8 20 8Z" fill="white" opacity="0.3" />
                            <circle cx="20" cy="14" r="3" fill="white" />
                            <path d="M15 33H25V35C25 36.1 24.1 37 23 37H17C15.9 37 15 36.1 15 35V33Z" fill="#FF6933" opacity="0.7" />
                        </svg>
                    </div>

                    <h1 className="mb-4 text-4xl font-bold text-white">
                        WiseCare
                    </h1>
                    <p className="mb-2 text-lg font-medium text-header-subtitle">
                        AI-Powered Elderly Care Platform
                    </p>
                    <p className="text-sm leading-relaxed text-white/50">
                        Empowering families and caregivers with intelligent monitoring,
                        automated service requests, and real-time health alerts — so your
                        loved ones always have the care they deserve.
                    </p>

                    {/* Feature pills */}
                    <div className="mt-10 flex flex-wrap justify-center gap-3">
                        {[
                            { icon: shieldIcon, label: 'Health Monitoring' },
                            { icon: heartIcon, label: 'Family Connect' },
                            { icon: bellIcon, label: 'Smart Alerts' },
                        ].map((f) => (
                            <span
                                key={f.label}
                                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-sm"
                            >
                                <span className="text-primary">{f.icon}</span>
                                {f.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Bottom attribution */}
                <p className="absolute bottom-6 text-xs text-white/30">
                    © 2026 WiseCare — Care, Simplified.
                </p>
            </div>

            {/* ──── Right Login Panel (40%) ──── */}
            <div className="flex w-full flex-col justify-center bg-warm-bg px-6 lg:w-[40%] lg:px-16">
                {/* Mobile logo (hidden on desktop) */}
                <div className="mb-8 flex items-center gap-3 lg:hidden">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-icon-shield text-lg font-bold text-white shadow-lg">
                        W
                    </div>
                    <span className="text-xl font-bold text-on-background">WiseCare</span>
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

                        <p className="text-center text-sm text-text-muted">
                            Family member?{' '}
                            <a href={ROUTES.FAMILY_SIGNUP} className="font-semibold text-primary hover:text-primary-hover">
                                Create an account
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Inline SVG icons for feature pills
// ---------------------------------------------------------------------------

const shieldIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const heartIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const bellIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);
