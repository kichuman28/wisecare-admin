import { Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth';

/**
 * Admin layout shell — wraps all /admin/* routes.
 * Placeholder for sidebar, header, and nav when built.
 */
export function AdminLayout() {
    const { user, logout } = useAuth();

    return (
        <div className="flex min-h-screen flex-col">
            {/* Top bar — placeholder */}
            <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
                <h1 className="text-lg font-semibold text-gray-900">
                    WiseCare Admin
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                        {user?.name ?? 'Admin'}
                    </span>
                    <button
                        onClick={logout}
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                        Sign out
                    </button>
                </div>
            </header>

            {/* Page content */}
            <main className="flex-1 bg-gray-50 p-6">
                <Outlet />
            </main>
        </div>
    );
}
