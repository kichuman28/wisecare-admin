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
            // Link is the final onboarding step — mark as COMPLETE
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
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Link with your relative
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Step 2 of 2 — Enter the invite code shared by your elderly relative
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMessage && (
                        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <label htmlFor="invite-code" className="block text-sm font-medium text-gray-700">
                            Invite Code
                        </label>
                        <input id="invite-code" type="text" required value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase tracking-widest shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="WC-XXXXXX" />
                    </div>

                    <button type="submit" disabled={mutation.isPending}
                        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        {mutation.isPending ? 'Linking…' : 'Link account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
