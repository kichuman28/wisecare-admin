import { useState } from 'react';
import { useUsers, useToggleUserStatus } from '../admin.hooks';
import { DataTable, LoadingState, EmptyState, UsersIcon } from '@/shared/components';
import { CreateAgentModal } from '../components/CreateAgentModal';
import { UserDetailDrawer } from '../components/UserDetailDrawer';
import type { AdminUser, UserRole } from '../admin.types';
import type { Column } from '@/shared/components';

const ROLE_TABS: { label: string; value: UserRole | undefined }[] = [
    { label: 'All', value: undefined },
    { label: 'Elderly', value: 'ELDERLY' },
    { label: 'Family', value: 'FAMILY' },
    { label: 'Agent', value: 'AGENT' },
    { label: 'Admin', value: 'ADMIN' },
];

const ROLE_BADGE: Record<UserRole, string> = {
    ELDERLY: 'bg-blue-100 text-blue-700',
    FAMILY: 'bg-purple-100 text-purple-700',
    AGENT: 'bg-emerald-100 text-emerald-700',
    ADMIN: 'bg-navy/10 text-navy',
};

export function UsersPage() {
    const [roleFilter, setRoleFilter] = useState<UserRole | undefined>(undefined);
    const [showCreateAgent, setShowCreateAgent] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const { data, isLoading, isError } = useUsers(roleFilter);
    const toggleStatus = useToggleUserStatus();

    const handleToggleActive = (user: AdminUser) => {
        toggleStatus.mutate({ userId: user.userId, data: { active: !user.active } });
    };

    const columns: Column<AdminUser>[] = [
        {
            key: 'name', header: 'Name',
            render: (u) => (
                <button type="button" onClick={() => setSelectedUserId(u.userId)}
                    className="text-left hover:text-primary">
                    <p className="font-medium text-on-background">{u.name}</p>
                    <p className="text-xs text-text-muted">{u.email}</p>
                </button>
            ),
        },
        {
            key: 'role', header: 'Role', align: 'center',
            render: (u) => (
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_BADGE[u.role]}`}>
                    {u.role}
                </span>
            ),
        },
        { key: 'city', header: 'City', render: (u) => <span className="text-sm">{u.city ?? '—'}</span> },
        { key: 'phone', header: 'Phone', render: (u) => <span className="text-sm text-text-muted">{u.phone ?? '—'}</span> },
        {
            key: 'active', header: 'Status', align: 'center',
            render: (u) => (
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            key: 'createdAt', header: 'Joined',
            render: (u) => <span className="text-xs text-text-muted">{new Date(u.createdAt).toLocaleDateString('en-IN')}</span>,
        },
        {
            key: 'actions', header: '', align: 'center',
            render: (u) => (
                <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setSelectedUserId(u.userId)}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary ring-1 ring-primary/30 hover:bg-primary/5">
                        View
                    </button>
                    <button type="button" onClick={() => handleToggleActive(u)}
                        disabled={toggleStatus.isPending}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${u.active
                            ? 'text-red-600 ring-1 ring-red-200 hover:bg-red-50'
                            : 'text-green-600 ring-1 ring-green-200 hover:bg-green-50'}`}>
                        {u.active ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-on-background">Users</h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Manage all platform users — {data?.count ?? '…'} total.
                    </p>
                </div>
                <button type="button" onClick={() => setShowCreateAgent(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 hover:bg-primary-hover">
                    <UsersIcon size={16} /> Create Agent
                </button>
            </div>

            {/* Role tabs */}
            <div className="flex flex-wrap gap-1 rounded-xl bg-surface p-1 ring-1 ring-outline">
                {ROLE_TABS.map((tab) => (
                    <button key={tab.label} type="button"
                        onClick={() => setRoleFilter(tab.value)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${roleFilter === tab.value
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-text-muted hover:text-on-background'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {isLoading && <LoadingState message="Loading users…" />}
            {isError && (
                <div className="rounded-xl border border-red-200 bg-error-light p-4 text-sm text-error">
                    Failed to load users.
                </div>
            )}
            {data && data.users.length === 0 && (
                <EmptyState title="No users found" description="No users match the current filter." icon="👥" />
            )}
            {data && data.users.length > 0 && (
                <DataTable columns={columns} data={data.users} rowKey={(u) => u.userId} />
            )}

            {/* Modals */}
            {showCreateAgent && <CreateAgentModal onClose={() => setShowCreateAgent(false)} />}
            {selectedUserId && <UserDetailDrawer userId={selectedUserId} onClose={() => setSelectedUserId(null)} />}
        </div>
    );
}
