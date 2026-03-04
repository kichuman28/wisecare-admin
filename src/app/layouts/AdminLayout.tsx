import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/shared/constants';

const NAV_ITEMS = [
    { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: '📊' },
    { label: 'Requests', path: ROUTES.ADMIN_SERVICE_REQUESTS, icon: '📋' },
    { label: 'Alerts', path: ROUTES.ADMIN_ALERTS, icon: '🔔' },
    { label: 'Users', path: ROUTES.ADMIN_USERS, icon: '👥' },
];

/**
 * Admin layout shell — wraps all /admin/* routes.
 * Includes sidebar navigation and top header.
 */
export function AdminLayout() {
    const { user, logout } = useAuth();

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
                {/* Logo */}
                <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                        W
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                        WiseCare
                    </span>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                        ADMIN
                    </span>
                </div>

                {/* Nav links */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === ROUTES.ADMIN_DASHBOARD}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${isActive
                                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* User info & sign out */}
                <div className="border-t border-gray-100 px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-xs font-bold text-white">
                            {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                                {user?.name ?? 'Admin'}
                            </p>
                            <p className="truncate text-xs text-gray-400">
                                {user?.email ?? ''}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="mt-3 w-full rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
}
