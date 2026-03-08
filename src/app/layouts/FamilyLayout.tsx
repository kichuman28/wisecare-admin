import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/shared/constants';
import {
    DashboardIcon,
    ActivityIcon,
    RequestsIcon,
    LogOutIcon,
} from '@/shared/components/Icons';

// Stub missing Icons for now (Wallet, Pill) with existing ones until we create them
const PillIcon = ActivityIcon; // We'll update Icons setup later or use equivalents
const WalletIcon = DashboardIcon;

const NAV_ITEMS = [
    { label: 'Overview', path: ROUTES.FAMILY_DASHBOARD, icon: DashboardIcon },
    { label: 'Timeline', path: ROUTES.FAMILY_TIMELINE, icon: ActivityIcon },
    { label: 'Medications', path: ROUTES.FAMILY_MEDICATIONS, icon: PillIcon },
    { label: 'Wallet', path: ROUTES.FAMILY_WALLET, icon: WalletIcon },
    { label: 'Requests', path: ROUTES.FAMILY_SERVICE_REQUESTS, icon: RequestsIcon },
];

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
 * Family layout shell — wraps all /family/* routes.
 * Collapsible sidebar: icons-only rail when collapsed, full sidebar when expanded.
 * Main content reflows to fill available space.
 */
export function FamilyLayout() {
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-surface flex-col md:flex-row">
            {/* ── Sidebar ── */}
            <aside
                className={`flex shrink-0 flex-col bg-gradient-to-b from-gradient-top to-gradient-bottom transition-all duration-300 ease-in-out z-20 md:relative absolute h-full ${collapsed ? 'w-[72px] -translate-x-[72px] md:translate-x-0' : 'w-64 translate-x-0'
                    }`}
            >
                {/* Logo */}
                <div className={`flex items-center border-b border-white/10 py-4 ${collapsed ? 'justify-center px-2' : 'gap-3 px-5'}`}>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-icon-shield shadow-lg">
                        <img src="/wisecare_favicon.png" alt="WiseCare Logo" className="h-full w-full object-cover" />
                    </div>
                    {!collapsed && (
                        <>
                            <span className="text-lg font-bold text-white">
                                WiseCare
                            </span>
                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                                FAMILY
                            </span>
                        </>
                    )}
                </div>

                {/* Nav links */}
                <nav className={`flex-1 space-y-1 py-4 ${collapsed ? 'px-2' : 'px-3'} overflow-y-auto`}>
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === ROUTES.FAMILY_DASHBOARD}
                            title={collapsed ? item.label : undefined}
                            className={({ isActive }) =>
                                `flex items-center rounded-xl text-sm font-medium transition-all ${collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'
                                } ${isActive
                                    ? `bg-white/10 text-white shadow-sm ${collapsed ? '' : 'border-l-[3px] border-emerald-400'}`
                                    : `text-white/60 hover:bg-white/5 hover:text-white/80 ${collapsed ? '' : 'border-l-[3px] border-transparent'}`
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        size={collapsed ? 20 : 18}
                                        className={isActive ? 'text-emerald-400' : 'text-white/60'}
                                    />
                                    {!collapsed && item.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Collapse toggle */}
                <div className={`border-t border-white/10 hidden md:block ${collapsed ? 'px-2' : 'px-3'} py-2`}>
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
                <div className={`border-t border-white/10 py-4 ${collapsed ? 'px-2' : 'px-4'} hidden md:block`}>
                    <div className={`flex items-center ${collapsed ? 'flex-col gap-4' : 'gap-3'}`}>
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-icon-shield text-xs font-bold text-white">
                                {user?.name?.charAt(0)?.toUpperCase() ?? 'F'}
                            </div>
                            {!collapsed && (
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-white">
                                        {user?.name ?? 'Family Member'}
                                    </p>
                                    <p className="truncate text-xs text-white/50">
                                        {user?.email ?? ''}
                                    </p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={logout}
                            className="shrink-0 rounded-lg p-2 text-white/50 transition-colors hover:bg-red-500/10 hover:text-red-400 flex justify-center items-center"
                            title="Sign out"
                        >
                            <LogOutIcon size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── Main content (reflows with sidebar) ── */}
            <main className="flex-1 overflow-y-auto w-full relative">
                {/* Mobile header (hamburger) */}
                <header className="md:hidden flex items-center justify-between bg-navy-dark px-4 py-3 shadow-md sticky top-0 z-10 w-full">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setCollapsed(!collapsed)} className="text-white p-1">
                            <span className="text-xl">☰</span>
                        </button>
                        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-icon-shield">
                            <img src="/wisecare_favicon.png" alt="WiseCare Logo" className="h-full w-full object-cover" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={logout}
                            className="rounded-lg px-2 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-white/10"
                        >
                            <LogOutIcon size={16} />
                        </button>
                    </div>
                </header>

                {/* Mobile Sidebar overlay */}
                {!collapsed && (
                    <div
                        className="fixed inset-0 bg-black/50 z-10 md:hidden"
                        onClick={() => setCollapsed(true)}
                    ></div>
                )}

                <div className="p-5 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
