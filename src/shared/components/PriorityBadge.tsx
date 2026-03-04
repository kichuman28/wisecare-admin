import type { ServiceRequestPriority } from '@/features/admin/admin.types';

const priorityStyles: Record<ServiceRequestPriority, string> = {
    LOW: 'bg-gray-50 text-gray-600 border-gray-200',
    NORMAL: 'bg-blue-50 text-blue-600 border-blue-200',
    HIGH: 'bg-orange-50 text-orange-600 border-orange-200',
    URGENT: 'bg-red-50 text-red-600 border-red-200',
};

const priorityIcons: Record<ServiceRequestPriority, string> = {
    LOW: '↓',
    NORMAL: '•',
    HIGH: '↑',
    URGENT: '⚡',
};

interface PriorityBadgeProps {
    priority: ServiceRequestPriority;
    className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${priorityStyles[priority]} ${className}`}
        >
            <span>{priorityIcons[priority]}</span>
            {priority}
        </span>
    );
}
