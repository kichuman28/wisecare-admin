import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useAuth, authApi } from '@/features/auth';
import { getOnboardingRoute, ROUTES } from '@/shared/constants';
import type { AuthResponse } from '@/shared/types';
import type { ApiError } from '@/shared/types';

export function FamilySignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const signupMutation = useMutation<
        { data: AuthResponse },
        AxiosError<ApiError>,
        { name: string; email: string; password: string; phone: string; city: string }
    >({
        mutationFn: (data) =>
            authApi.signUp({
                ...data,
                role: 'FAMILY',
            }),
        onSuccess: ({ data }) => {
            login(data);
            const route = getOnboardingRoute(data.onboardingStep);
            navigate(route, { replace: true });
        },
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !password.trim()) return;
        signupMutation.mutate({
            name: name.trim(),
            email: email.trim(),
            password,
            phone: phone.trim(),
            city: city.trim(),
        });
    };

    const errorMessage =
        signupMutation.error?.response?.data?.message ??
        (signupMutation.isError ? 'Something went wrong. Please try again.' : null);

    const inputClasses =
        'mt-1.5 block w-full rounded-xl border border-outline bg-card-surface px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

    return (
        <div className="flex min-h-screen">
            {/* ── Left branding panel (60%) ── */}
            <div className="relative hidden w-[60%] overflow-hidden bg-gradient-to-br from-gradient-top via-navy to-gradient-bottom lg:flex lg:flex-col lg:items-center lg:justify-center">
                {/* Decorative blurs */}
                <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-accent-blue/10 blur-3xl" />

                <div className="relative z-10 max-w-md px-12 text-center">
                    <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-icon-shield/80 shadow-2xl backdrop-blur-sm">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <path d="M20 4C14.5 4 10 8 10 13C10 16 11.5 18.5 14 20L12 32H28L26 20C28.5 18.5 30 16 30 13C30 8 25.5 4 20 4Z" fill="#FF6933" opacity="0.9" />
                            <circle cx="20" cy="14" r="3" fill="white" />
                            <path d="M15 33H25V35C25 36.1 24.1 37 23 37H17C15.9 37 15 36.1 15 35V33Z" fill="#FF6933" opacity="0.7" />
                        </svg>
                    </div>

                    <h1 className="mb-4 text-3xl font-bold text-white">Join WiseCare</h1>
                    <p className="mb-2 text-lg font-medium text-header-subtitle">
                        Family Portal
                    </p>
                    <p className="text-sm leading-relaxed text-white/50">
                        Create your family account to monitor your elderly loved
                        one's wellbeing, manage care services, and stay connected.
                    </p>

                    {/* Feature pills */}
                    <div className="mt-10 flex flex-wrap justify-center gap-3">
                        {['Real-time Alerts', 'Care Dashboard', 'Service Requests'].map((label) => (
                            <span
                                key={label}
                                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-sm"
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="absolute bottom-6 text-xs text-white/30">
                    © 2026 WiseCare — Care, Simplified.
                </p>
            </div>

            {/* ── Right form panel (40%) ── */}
            <div className="flex w-full flex-col justify-center bg-warm-bg px-6 py-8 lg:w-[40%] lg:px-16">
                {/* Mobile header */}
                <div className="mb-6 flex items-center gap-3 lg:hidden">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-icon-shield shadow-lg">
                        <img src="/wisecare_favicon.png" alt="WiseCare Logo" className="h-full w-full object-cover" />
                    </div>
                    <span className="text-xl font-bold text-on-background">WiseCare</span>
                </div>

                <div className="mx-auto w-full max-w-sm">
                    <h2 className="mb-1 text-2xl font-bold text-on-background">
                        Create your account
                    </h2>
                    <p className="mb-8 text-sm text-text-muted">
                        Sign up as a family member
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {errorMessage && (
                            <div className="rounded-lg bg-error-light px-4 py-3 text-sm text-error">
                                {errorMessage}
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-on-background">
                                Full Name
                            </label>
                            <input id="name" type="text" required value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputClasses}
                                placeholder="Your name" />
                        </div>

                        <div>
                            <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-on-background">
                                Email
                            </label>
                            <input id="signup-email" type="email" autoComplete="email" required value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClasses}
                                placeholder="you@example.com" />
                        </div>

                        <div>
                            <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-on-background">
                                Password
                            </label>
                            <input id="signup-password" type="password" autoComplete="new-password" required value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputClasses}
                                placeholder="Min 6 characters" minLength={6} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-on-background">
                                    Phone
                                </label>
                                <input id="phone" type="tel" required value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className={inputClasses}
                                    placeholder="+91..." />
                            </div>
                            <div>
                                <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-on-background">
                                    City
                                </label>
                                <input id="city" type="text" required value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className={inputClasses}
                                    placeholder="Chennai" />
                            </div>
                        </div>

                        <button type="submit" disabled={signupMutation.isPending}
                            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            {signupMutation.isPending ? 'Creating account…' : 'Sign up'}
                        </button>

                        <p className="text-center text-sm text-text-muted">
                            Already have an account?{' '}
                            <a href={ROUTES.LOGIN} className="font-semibold text-primary hover:text-primary-hover">
                                Sign in
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
