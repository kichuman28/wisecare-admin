import { useMemo } from 'react';
import type { ServiceRequest } from '../admin.types';
import { DataTable, StatusBadge, PriorityBadge } from '@/shared/components';
import type { Column } from '@/shared/components';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function truncateId(id: string): string {
    return id.slice(0, 8) + '…';
}

// ---------------------------------------------------------------------------
// RequestsTable
// ---------------------------------------------------------------------------

interface RequestsTableProps {
    requests: ServiceRequest[];
    onAssign: (request: ServiceRequest) => void;
}

export function RequestsTable({ requests, onAssign }: RequestsTableProps) {
    const columns = useMemo<Column<ServiceRequest>[]>(
        () => [
            {
                key: 'requestId',
                header: 'ID',
                render: (r) => (
                    <span className="font-mono text-xs text-text-muted" title={r.requestId}>
                        {truncateId(r.requestId)}
                    </span>
                ),
            },
            {
                key: 'elderlyName',
                header: 'Elderly',
                render: (r) => (
                    <div>
                        <p className="font-medium text-on-background">{r.elderlyName}</p>
                        <p className="text-xs text-text-muted">{r.elderlyCity}</p>
                    </div>
                ),
            },
            {
                key: 'type',
                header: 'Type',
                render: (r) => (
                    <span className="text-xs text-secondary">
                        {r.requestType} / {r.category}
                    </span>
                ),
            },
            {
                key: 'title',
                header: 'Description',
                render: (r) => (
                    <span className="max-w-[200px] truncate text-sm" title={r.description}>
                        {r.title}
                    </span>
                ),
            },
            {
                key: 'status',
                header: 'Status',
                align: 'center',
                render: (r) => <StatusBadge status={r.status} />,
            },
            {
                key: 'priority',
                header: 'Priority',
                align: 'center',
                render: (r) => <PriorityBadge priority={r.priority} />,
            },
            {
                key: 'assignedAgent',
                header: 'Assigned To',
                render: (r) =>
                    r.assignedAgentName ? (
                        <span className="text-sm font-medium text-on-background">
                            {r.assignedAgentName}
                        </span>
                    ) : (
                        <span className="text-xs italic text-text-muted">
                            Unassigned
                        </span>
                    ),
            },
            {
                key: 'createdAt',
                header: 'Created',
                render: (r) => (
                    <span className="text-xs text-text-muted">
                        {formatDate(r.createdAt)}
                    </span>
                ),
            },
            {
                key: 'actions',
                header: '',
                align: 'center',
                render: (r) =>
                    !r.assignedAgentId ? (
                        <button
                            type="button"
                            onClick={() => onAssign(r)}
                            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md active:scale-95"
                        >
                            Assign
                        </button>
                    ) : null,
            },
        ],
        [onAssign],
    );

    return (
        <DataTable
            columns={columns}
            data={requests}
            rowKey={(r) => r.requestId}
        />
    );
}
