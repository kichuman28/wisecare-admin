import { useState } from 'react';
import type { ServiceRequest, ServiceRequestStatus } from '../admin.types';
import { useRequests } from '../admin.hooks';
import { RequestsTable } from '../components/RequestsTable';
import { AssignAgentModal } from '../components/AssignAgentModal';
import { LoadingState, EmptyState } from '@/shared/components';

// ---------------------------------------------------------------------------
// Filter tabs
// ---------------------------------------------------------------------------

const TABS: { label: string; value: ServiceRequestStatus }[] = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Assigned', value: 'ASSIGNED' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Rejected', value: 'REJECTED' },
];

// ---------------------------------------------------------------------------
// RequestsPage
// ---------------------------------------------------------------------------

export function RequestsPage() {
    const [activeTab, setActiveTab] = useState<ServiceRequestStatus>('PENDING');
    const [assignTarget, setAssignTarget] = useState<ServiceRequest | null>(null);

    const { data, isLoading, isError } = useRequests(activeTab);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-on-background">
                    Service Requests
                </h1>
                <p className="mt-1 text-sm text-text-muted">
                    Manage all service requests across elderly users.
                </p>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-1 rounded-xl bg-surface p-1 ring-1 ring-outline">
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => setActiveTab(tab.value)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === tab.value
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-text-muted hover:text-on-background'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {isLoading && <LoadingState message="Loading requests…" />}

            {isError && (
                <div className="rounded-xl border border-red-200 bg-error-light p-4 text-sm text-error">
                    Failed to load service requests. Please try again later.
                </div>
            )}

            {data && data.requests.length === 0 && (
                <EmptyState
                    title={`No ${activeTab.toLowerCase().replace('_', ' ')} requests`}
                    description="There are no requests matching this filter."
                    icon="📭"
                />
            )}

            {data && data.requests.length > 0 && (
                <RequestsTable
                    requests={data.requests}
                    onAssign={setAssignTarget}
                />
            )}

            {/* Assign Agent Modal */}
            {assignTarget && (
                <AssignAgentModal
                    request={assignTarget}
                    onClose={() => setAssignTarget(null)}
                />
            )}
        </div>
    );
}
