import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useAuth } from '@/features/auth';
import { familyApi } from '../family.api';
import { ROUTES } from '@/shared/constants';
import type { FamilyRelationship } from '../family.types';
import type { ApiError } from '@/shared/types';

const RELATIONSHIPS: FamilyRelationship[] = [
    'Son', 'Daughter', 'Spouse', 'Sibling', 'Other',
];

export function FamilyBasicOnboardingPage() {
    const [relationship, setRelationship] = useState<FamilyRelationship>('Son');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const { updateUser } = useAuth();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: familyApi.submitBasicInfo,
        onSuccess: ({ data }) => {
            updateUser({ onboardingStep: data.onboardingStep });
            navigate(ROUTES.FAMILY_ONBOARDING_LINK, { replace: true });
        },
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!city.trim() || !phone.trim()) return;
        mutation.mutate({ relationship, city: city.trim(), phone: phone.trim() });
    };

    const errorMessage =
        (mutation.error as AxiosError<ApiError>)?.response?.data?.message ??
        (mutation.isError ? 'Something went wrong. Please try again.' : null);

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

                    <h1 className="mb-4 text-3xl font-bold text-white">Getting Started</h1>
                    <p className="text-sm leading-relaxed text-white/50">
                        Just a couple of quick steps to set up your family account
                        and connect with your elderly loved one.
                    </p>

                    {/* Step indicator */}
                    <div className="mt-10 flex items-center justify-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">1</div>
                            <span className="text-sm font-medium text-white">Basic Info</span>
                        </div>
                        <div className="h-px w-8 bg-white/20" />
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white/40">2</div>
                            <span className="text-sm text-white/40">Link Relative</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right form panel (40%) ── */}
            <div className="flex w-full flex-col justify-center bg-warm-bg px-6 lg:w-[40%] lg:px-16">
                {/* Mobile header */}
                <div className="mb-6 flex items-center gap-3 lg:hidden">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-icon-shield text-lg font-bold text-white shadow-lg">W</div>
                    <span className="text-xl font-bold text-on-background">WiseCare</span>
                </div>

                {/* Mobile step indicator */}
                <div className="mb-6 flex items-center gap-2 lg:hidden">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">1</div>
                    <div className="h-px w-4 bg-outline" />
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-outline text-[10px] font-medium text-text-muted">2</div>
                    <span className="ml-2 text-xs text-text-muted">Step 1 of 2</span>
                </div>

                <div className="mx-auto w-full max-w-sm">
                    <h2 className="mb-1 text-2xl font-bold text-on-background">
                        Tell us about yourself
                    </h2>
                    <p className="mb-8 text-sm text-text-muted">
                        We need a few details to get you started.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errorMessage && (
                            <div className="rounded-lg bg-error-light px-4 py-3 text-sm text-error">
                                {errorMessage}
                            </div>
                        )}

                        <div>
                            <label htmlFor="relationship" className="mb-1.5 block text-sm font-medium text-on-background">
                                Relationship to elderly
                            </label>
                            <select id="relationship" value={relationship}
                                onChange={(e) => setRelationship(e.target.value as FamilyRelationship)}
                                className={inputClasses}>
                                {RELATIONSHIPS.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="onboard-city" className="mb-1.5 block text-sm font-medium text-on-background">
                                City
                            </label>
                            <input id="onboard-city" type="text" required value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className={inputClasses}
                                placeholder="Chennai" />
                        </div>

                        <div>
                            <label htmlFor="onboard-phone" className="mb-1.5 block text-sm font-medium text-on-background">
                                Phone
                            </label>
                            <input id="onboard-phone" type="tel" required value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={inputClasses}
                                placeholder="+91XXXXXXXXXX" />
                        </div>

                        <button type="submit" disabled={mutation.isPending}
                            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            {mutation.isPending ? 'Saving…' : 'Continue'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
