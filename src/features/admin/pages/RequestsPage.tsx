import { useState, useMemo, useEffect } from 'react';
import type { ServiceRequest, ServiceRequestStatus, RequestCategory, ServiceRequestPriority } from '../admin.types';
import { useRequests } from '../admin.hooks';
import { RequestsTable } from '../components/RequestsTable';
import { AssignAgentModal } from '../components/AssignAgentModal';
import { RequestDetailModal } from '../components/RequestDetailModal';
import { LoadingState, EmptyState, CustomSelect, Pagination } from '@/shared/components';
import type { SelectOption } from '@/shared/components/CustomSelect';

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

const PRIORITY_WEIGHTS: Record<ServiceRequestPriority, number> = {
    LOW: 1,
    NORMAL: 2,
    HIGH: 3,
    URGENT: 4
};

// ---------------------------------------------------------------------------
// RequestsPage
// ---------------------------------------------------------------------------

export function RequestsPage() {
    const [activeTab, setActiveTab] = useState<ServiceRequestStatus>('PENDING');
    const [assignTarget, setAssignTarget] = useState<ServiceRequest | null>(null);
    const [viewTarget, setViewTarget] = useState<ServiceRequest | null>(null);

    // Advanced Filters & Pagination state
    const [selectedCategory, setSelectedCategory] = useState<RequestCategory | 'ALL'>('ALL');
    const [selectedPriority, setSelectedPriority] = useState<ServiceRequestPriority | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'PRIORITY'>('NEWEST');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    const { data, isLoading, isError } = useRequests(activeTab);

    // Reset page to 1 when any filter or tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, selectedCategory, selectedPriority, sortBy, pageSize]);

    // Compute derived data
    const processedRequests = useMemo(() => {
        if (!data?.requests) return [];

        // 1. Filter
        let result = data.requests.filter(req => {
            if (selectedCategory !== 'ALL' && req.category !== selectedCategory) return false;
            if (selectedPriority !== 'ALL' && req.priority !== selectedPriority) return false;
            return true;
        });

        // 2. Sort
        result.sort((a, b) => {
            if (sortBy === 'NEWEST') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (sortBy === 'OLDEST') {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            if (sortBy === 'PRIORITY') {
                const wA = PRIORITY_WEIGHTS[a.priority] || 0;
                const wB = PRIORITY_WEIGHTS[b.priority] || 0;
                if (wA !== wB) return wB - wA; // Highest first
                // Secondary sort: newest first
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return 0;
        });

        return result;
    }, [data?.requests, selectedCategory, selectedPriority, sortBy]);

    const totalRequests = processedRequests.length;
    const paginatedRequests = processedRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const categoryOptions: SelectOption<RequestCategory | 'ALL'>[] = [
        { label: 'All Categories', value: 'ALL' },
        { label: 'Grocery', value: 'GROCERY' },
        { label: 'Pharmacy', value: 'PHARMACY' },
        { label: 'Medical', value: 'MEDICAL' },
        { label: 'General', value: 'GENERAL' },
        { label: 'Medicine', value: 'MEDICINE' },
        { label: 'Food', value: 'FOOD' },
        { label: 'Doctor', value: 'DOCTOR' },
        { label: 'Other', value: 'OTHER' },
    ];

    const priorityOptions: SelectOption<ServiceRequestPriority | 'ALL'>[] = [
        { label: 'All Priorities', value: 'ALL' },
        { label: 'Low', value: 'LOW' },
        { label: 'Normal', value: 'NORMAL' },
        { label: 'High', value: 'HIGH' },
        { label: 'Urgent', value: 'URGENT' },
    ];

    const sortOptions: SelectOption<'NEWEST' | 'OLDEST' | 'PRIORITY'>[] = [
        { label: 'Newest First', value: 'NEWEST' },
        { label: 'Oldest First', value: 'OLDEST' },
        { label: 'Highest Priority', value: 'PRIORITY' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-on-background">
                        Service Requests
                    </h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Manage all service requests across elderly users.
                    </p>
                </div>
            </div>

            {/* Combined Filters & Tabs */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl bg-surface p-4 ring-1 ring-outline">
                {/* Status Tabs */}
                <div className="flex gap-1 rounded-lg bg-warm-bg p-1 ring-1 ring-outline">
                    {TABS.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setActiveTab(tab.value)}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${activeTab === tab.value
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-text-muted hover:text-on-background'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="h-6 w-px bg-outline" />

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Category</label>
                        <CustomSelect
                            value={selectedCategory}
                            options={categoryOptions}
                            onChange={(val) => setSelectedCategory(val)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Priority</label>
                        <CustomSelect
                            value={selectedPriority}
                            options={priorityOptions}
                            onChange={(val) => setSelectedPriority(val)}
                        />
                    </div>

                    <div className="flex items-center gap-2 sm:ml-auto">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Sort By</label>
                        <CustomSelect
                            value={sortBy}
                            options={sortOptions}
                            onChange={(val) => setSortBy(val)}
                        />
                    </div>
                </div>
            </div>



            {/* Content */}
            {isLoading && <LoadingState message="Loading requests…" />}

            {isError && (
                <div className="rounded-xl border border-red-200 bg-error-light p-4 text-sm text-error">
                    Failed to load service requests. Please try again later.
                </div>
            )}

            {data && totalRequests === 0 && (
                <EmptyState
                    title={`No ${activeTab.toLowerCase().replace('_', ' ')} requests`}
                    description="There are no requests matching this filter."
                    icon="📭"
                />
            )}

            {data && totalRequests > 0 && (
                <div className="space-y-4">
                    <Pagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={totalRequests}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                    />

                    <RequestsTable
                        requests={paginatedRequests}
                        onRowClick={setViewTarget}
                    />
                </div>
            )}

            {/* Detail Modal */}
            {viewTarget && (
                <RequestDetailModal
                    request={viewTarget}
                    onClose={() => setViewTarget(null)}
                    onAssignAgent={() => {
                        setAssignTarget(viewTarget);
                        setViewTarget(null);
                    }}
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
