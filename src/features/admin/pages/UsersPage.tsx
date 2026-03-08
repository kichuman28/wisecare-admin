import { useState, useMemo, useEffect } from 'react';
import { useUsers, useToggleUserStatus } from '../admin.hooks';
import { DataTable, LoadingState, EmptyState, UsersIcon, CustomSelect, Pagination, RefreshButton } from '@/shared/components';
import { CreateAgentModal } from '../components/CreateAgentModal';
import { UserDetailDrawer } from '../components/UserDetailDrawer';
import type { AdminUser, UserRole } from '../admin.types';
import type { Column } from '@/shared/components';
import type { SelectOption } from '@/shared/components/CustomSelect';

const ROLE_TABS: { label: string; value: UserRole | undefined }[] = [
    { label: 'All', value: undefined },
    { label: 'Elderly', value: 'ELDERLY' },
    { label: 'Family', value: 'FAMILY' },
    { label: 'Agent', value: 'AGENT' },
    { label: 'Admin', value: 'ADMIN' },
];

const STATUS_OPTIONS: SelectOption<string>[] = [
    { label: 'All Statuses', value: '' },
    { label: 'Active Only', value: 'true' },
    { label: 'Inactive Only', value: 'false' },
];

const ROLE_BADGE: Record<UserRole, string> = {
    ELDERLY: 'bg-blue-100 text-blue-700',
    FAMILY: 'bg-purple-100 text-purple-700',
    AGENT: 'bg-emerald-100 text-emerald-700',
    ADMIN: 'bg-navy/10 text-navy',
};

export function UsersPage() {
    const [roleFilter, setRoleFilter] = useState<UserRole | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState('');
    const [showCreateAgent, setShowCreateAgent] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    const activeFilter = statusFilter === '' ? undefined : statusFilter === 'true';
    const { data, isLoading, isError, refetch, isRefetching } = useUsers(roleFilter, activeFilter);
    const toggleStatus = useToggleUserStatus();

    // Reset pagination
    useEffect(() => {
        setCurrentPage(1);
    }, [roleFilter, statusFilter, pageSize]);

    const users = data?.users || [];
    const totalUsers = data?.count || 0;

    const paginatedUsers = useMemo(() => {
        return users.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }, [users, currentPage, pageSize]);

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
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-on-background">Users</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Manage all platform users — {totalUsers} total.
                        </p>
                    </div>
                    <RefreshButton
                        onClick={() => refetch()}
                        isLoading={isLoading || isRefetching}
                        className="mt-1"
                    />
                </div>
                <button type="button" onClick={() => setShowCreateAgent(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 hover:bg-primary-hover">
                    <UsersIcon size={16} /> Create Agent
                </button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
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

                <div className="flex items-center gap-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Status</label>
                    <CustomSelect
                        value={statusFilter}
                        options={STATUS_OPTIONS}
                        onChange={setStatusFilter}
                    />
                </div>
            </div>

            {/* Content states */}
            {isLoading && <LoadingState message="Loading users…" />}
            {isError && (
                <div className="rounded-xl border border-red-200 bg-error-light p-4 text-sm text-error">
                    Failed to load users.
                </div>
            )}
            {data && users.length === 0 && (
                <EmptyState title="No users found" description="No users match the current filter." icon="👥" />
            )}

            {data && users.length > 0 && (
                <div className="space-y-4">
                    <Pagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={users.length}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                    />
                    <DataTable columns={columns} data={paginatedUsers} rowKey={(u) => u.userId} />
                </div>
            )}

            {/* Modals */}
            {showCreateAgent && <CreateAgentModal onClose={() => setShowCreateAgent(false)} />}
            {selectedUserId && <UserDetailDrawer userId={selectedUserId} onClose={() => setSelectedUserId(null)} />}
        </div>
    );
}
