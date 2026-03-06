import type { ServiceRequestStatus } from '@/features/admin/admin.types';

const statusStyles: Record<ServiceRequestStatus, string> = {
    PENDING:
        'bg-amber-50 text-amber-700 border-amber-200',
    ASSIGNED:
        'bg-blue-50 text-blue-700 border-blue-200',
    ACCEPTED:
        'bg-purple-50 text-purple-700 border-purple-200',
    IN_PROGRESS:
        'bg-orange-50 text-orange-700 border-orange-200',
    COMPLETED:
        'bg-green-50 text-green-700 border-green-200',
    REJECTED:
        'bg-red-50 text-red-700 border-red-200',
};

const statusLabels: Record<ServiceRequestStatus, string> = {
    PENDING: 'Pending',
    ASSIGNED: 'Assigned',
    ACCEPTED: 'Accepted',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    REJECTED: 'Rejected',
};

interface StatusBadgeProps {
    status: ServiceRequestStatus;
    className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status]} ${className}`}
        >
            {statusLabels[status]}
        </span>
    );
}
