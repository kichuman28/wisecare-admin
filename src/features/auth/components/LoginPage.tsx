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
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        WiseCare
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Sign in to your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMessage && (
                        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
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
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
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
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={signinMutation.isPending}
                        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {signinMutation.isPending ? 'Signing in…' : 'Sign in'}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Family member?{' '}
                        <a href={ROUTES.FAMILY_SIGNUP} className="font-medium text-blue-600 hover:text-blue-500">
                            Create an account
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}

