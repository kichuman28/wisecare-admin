import { useMemo } from 'react';
import type { ServiceRequest } from '../admin.types';
import { DataTable, StatusBadge, PriorityBadge } from '@/shared/components';
import type { Column } from '@/shared/components';

// ---------------------------------------------------------------------------
// RequestsTable
// ---------------------------------------------------------------------------

interface RequestsTableProps {
    requests: ServiceRequest[];
    onRowClick: (request: ServiceRequest) => void;
}

export function RequestsTable({ requests, onRowClick }: RequestsTableProps) {
    const columns = useMemo<Column<ServiceRequest>[]>(
        () => [
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
        ],
        [],
    );

    return (
        <DataTable
            columns={columns}
            data={requests}
            rowKey={(r) => r.requestId}
            onRowClick={onRowClick}
        />
    );
}
