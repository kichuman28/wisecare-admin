import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/shared/constants';
import { DashboardIcon, RequestsIcon, AlertIcon, UsersIcon, AlertTriangleIcon, ActivityIcon, LogOutIcon, RulesIcon, SettingsIcon } from '@/shared/components';

const NAV_ITEMS = [
    { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: DashboardIcon },
    { label: 'Requests', path: ROUTES.ADMIN_SERVICE_REQUESTS, icon: RequestsIcon },
    { label: 'Alerts', path: ROUTES.ADMIN_ALERTS, icon: AlertIcon },
    { label: 'Users', path: ROUTES.ADMIN_USERS, icon: UsersIcon },
    { label: 'Escalations', path: ROUTES.ADMIN_ESCALATIONS, icon: AlertTriangleIcon },
    { label: 'AI Ops', path: ROUTES.ADMIN_AI_OPS, icon: ActivityIcon },
    { label: 'Rules Engine', path: ROUTES.ADMIN_RULES, icon: RulesIcon },
    { label: 'AI Config', path: ROUTES.ADMIN_AI_CONFIG, icon: SettingsIcon },
];

// ---------------------------------------------------------------------------
// Toggle chevron icon
// ---------------------------------------------------------------------------

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
        >
            <polyline points="15 18 9 12 15 6" />
        </svg>
    );
}

/**
 * Admin layout shell — wraps all /admin/* routes.
 * Collapsible sidebar: icons-only rail when collapsed, full sidebar when expanded.
 * Main content reflows to fill available space.
 */
export function AdminLayout() {
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-surface">
            {/* ── Sidebar ── */}
            <aside
                className={`flex shrink-0 flex-col bg-gradient-to-b from-gradient-top to-gradient-bottom transition-all duration-300 ease-in-out ${collapsed ? 'w-[72px]' : 'w-64'
                    }`}
            >
                {/* Logo */}
                <div className={`flex items-center border-b border-white/10 py-4 ${collapsed ? 'justify-center px-2' : 'gap-3 px-5'}`}>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-icon-shield text-sm font-bold text-white shadow-lg">
                        W
                    </div>
                    {!collapsed && (
                        <>
                            <span className="text-lg font-bold text-white">
                                WiseCare
                            </span>
                            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                ADMIN
                            </span>
                        </>
                    )}
                </div>

                {/* Nav links */}
                <nav className={`flex-1 space-y-1 py-4 ${collapsed ? 'px-2' : 'px-3'}`}>
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === ROUTES.ADMIN_DASHBOARD}
                            title={collapsed ? item.label : undefined}
                            className={({ isActive }) =>
                                `flex items-center rounded-xl text-sm font-medium transition-all ${collapsed
                                    ? 'justify-center px-0 py-2.5'
                                    : 'gap-3 px-3 py-2.5'
                                } ${isActive
                                    ? `bg-white/10 text-white shadow-sm ${collapsed ? '' : 'border-l-[3px] border-primary'}`
                                    : `text-white/60 hover:bg-white/5 hover:text-white/80 ${collapsed ? '' : 'border-l-[3px] border-transparent'}`
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        size={collapsed ? 20 : 18}
                                        className={isActive ? 'text-primary' : 'text-white/60'}
                                    />
                                    {!collapsed && item.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Collapse toggle */}
                <div className={`border-t border-white/10 ${collapsed ? 'px-2' : 'px-3'} py-2`}>
                    <button
                        onClick={() => setCollapsed((c) => !c)}
                        className={`flex w-full items-center rounded-lg py-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'
                            }`}
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <ChevronIcon collapsed={collapsed} />
                        {!collapsed && (
                            <span className="text-xs font-medium">Collapse</span>
                        )}
                    </button>
                </div>

                {/* User info & sign out */}
                <div className={`border-t border-white/10 py-4 ${collapsed ? 'px-2' : 'px-4'}`}>
                    <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-icon-shield text-xs font-bold text-white">
                            {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                        </div>
                        {!collapsed && (
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-white">
                                    {user?.name ?? 'Admin'}
                                </p>
                                <p className="truncate text-xs text-white/50">
                                    {user?.email ?? ''}
                                </p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={logout}
                        title={collapsed ? 'Sign out' : undefined}
                        className={`mt-3 flex w-full items-center rounded-lg py-2 text-sm font-medium text-red-400 transition-colors hover:bg-white/10 ${collapsed ? 'justify-center px-0' : 'justify-center gap-2 px-3'
                            }`}
                    >
                        <LogOutIcon size={16} />
                        {!collapsed && 'Sign out'}
                    </button>
                </div>
            </aside>

            {/* ── Main content (reflows with sidebar) ── */}
            <main className="flex-1 overflow-y-auto p-5 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
}
