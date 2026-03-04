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
            // Update onboardingStep in auth context
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

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Tell us about yourself
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Step 1 of 2 — Basic information
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMessage && (
                        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
                            Relationship to elderly
                        </label>
                        <select id="relationship" value={relationship}
                            onChange={(e) => setRelationship(e.target.value as FamilyRelationship)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                            {RELATIONSHIPS.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="onboard-city" className="block text-sm font-medium text-gray-700">
                            City
                        </label>
                        <input id="onboard-city" type="text" required value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="London" />
                    </div>

                    <div>
                        <label htmlFor="onboard-phone" className="block text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <input id="onboard-phone" type="tel" required value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="+447911123456" />
                    </div>

                    <button type="submit" disabled={mutation.isPending}
                        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        {mutation.isPending ? 'Saving…' : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
}
