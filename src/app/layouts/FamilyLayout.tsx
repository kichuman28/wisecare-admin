import { Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth';

/**
 * Family layout shell — wraps all /family/* routes.
 * Navy header bar with brand styling.
 */
export function FamilyLayout() {
    const { user, logout } = useAuth();

    return (
        <div className="flex min-h-screen flex-col">
            {/* Top bar */}
            <header className="flex items-center justify-between bg-navy-dark px-6 py-3 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-icon-shield text-xs font-bold text-white">
                        W
                    </div>
                    <h1 className="text-lg font-semibold text-white">
                        WiseCare <span className="text-header-subtitle">Family</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-white/70">
                        {user?.name ?? 'Family'}
                    </span>
                    <button
                        onClick={logout}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-white/10"
                    >
                        Sign out
                    </button>
                </div>
            </header>

            {/* Page content */}
            <main className="flex-1 bg-surface p-6">
                <Outlet />
            </main>
        </div>
    );
}
