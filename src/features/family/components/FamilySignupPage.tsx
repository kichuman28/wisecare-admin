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
            // Route to the correct onboarding step
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

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        WiseCare — Family Sign Up
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Create your family account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMessage && (
                        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input id="name" type="text" required value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Your name" />
                    </div>

                    <div>
                        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input id="signup-email" type="email" autoComplete="email" required value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="you@example.com" />
                    </div>

                    <div>
                        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input id="signup-password" type="password" autoComplete="new-password" required value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Min 6 characters" minLength={6} />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <input id="phone" type="tel" required value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="+91XXXXXXXXXX" />
                    </div>

                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                        </label>
                        <input id="city" type="text" required value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Chennai" />
                    </div>

                    <button type="submit" disabled={signupMutation.isPending}
                        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        {signupMutation.isPending ? 'Creating account…' : 'Sign up'}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <a href={ROUTES.LOGIN} className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}
