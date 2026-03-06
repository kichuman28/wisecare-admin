import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useAuth } from '@/features/auth';
import { familyApi } from '../family.api';
import { ROUTES } from '@/shared/constants';
import type { ApiError } from '@/shared/types';

export function FamilyLinkPage() {
    const [inviteCode, setInviteCode] = useState('');
    const { updateUser } = useAuth();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: familyApi.linkWithInviteCode,
        onSuccess: () => {
            updateUser({
                onboardingStep: 'COMPLETE',
                profileComplete: true,
            });
            navigate(ROUTES.FAMILY_DASHBOARD, { replace: true });
        },
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!inviteCode.trim()) return;
        mutation.mutate({ inviteCode: inviteCode.trim() });
    };

    const errorMessage =
        (mutation.error as AxiosError<ApiError>)?.response?.data?.message ??
        (mutation.isError ? 'Something went wrong. Please try again.' : null);

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

                    <h1 className="mb-4 text-3xl font-bold text-white">Almost There!</h1>
                    <p className="text-sm leading-relaxed text-white/50">
                        Link your account with your elderly relative to start
                        monitoring their wellbeing and managing care services.
                    </p>

                    {/* Step indicator */}
                    <div className="mt-10 flex items-center justify-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <span className="text-sm text-white/50">Basic Info</span>
                        </div>
                        <div className="h-px w-8 bg-white/20" />
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">2</div>
                            <span className="text-sm font-medium text-white">Link Relative</span>
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
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <div className="h-px w-4 bg-outline" />
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">2</div>
                    <span className="ml-2 text-xs text-text-muted">Step 2 of 2</span>
                </div>

                <div className="mx-auto w-full max-w-sm">
                    <h2 className="mb-1 text-2xl font-bold text-on-background">
                        Link your account
                    </h2>
                    <p className="mb-8 text-sm text-text-muted">
                        Enter the invite code shared by your elderly relative.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errorMessage && (
                            <div className="rounded-lg bg-error-light px-4 py-3 text-sm text-error">
                                {errorMessage}
                            </div>
                        )}

                        <div>
                            <label htmlFor="invite-code" className="mb-1.5 block text-sm font-medium text-on-background">
                                Invite Code
                            </label>
                            <input id="invite-code" type="text" required value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                className="mt-1.5 block w-full rounded-xl border border-outline bg-card-surface px-4 py-3 text-sm uppercase tracking-widest shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="WC-XXXXXX" />
                        </div>

                        <button type="submit" disabled={mutation.isPending}
                            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            {mutation.isPending ? 'Linking…' : 'Link account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
