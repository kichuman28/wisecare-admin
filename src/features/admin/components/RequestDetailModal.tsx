import { useEffect } from 'react';
import type { ServiceRequest } from '../admin.types';
import { StatusBadge, PriorityBadge } from '@/shared/components';

interface RequestDetailModalProps {
    request: ServiceRequest;
    onClose: () => void;
    onAssignAgent: () => void;
}

function formatDateFull(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function InfoRow({ label, value, truncate = false }: { label: string; value: React.ReactNode; truncate?: boolean }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-outline py-3 last:border-0">
            <span className="shrink-0 text-sm font-medium text-text-muted">{label}</span>
            <span className={`text-right text-sm font-semibold text-on-background ${truncate ? 'break-all' : ''}`}>
                {value}
            </span>
        </div>
    );
}

export function RequestDetailModal({ request, onClose, onAssignAgent }: RequestDetailModalProps) {
    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:p-6" onClick={onClose}>
            <div
                className="flex w-full max-w-md animate-[fadeIn_150ms_ease-out] flex-col overflow-hidden rounded-2xl bg-card-surface shadow-2xl ring-1 ring-outline max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-outline px-6 py-4">
                    <h2 className="text-lg font-bold text-on-background">Request Details</h2>
                    <button type="button" onClick={onClose}
                        className="rounded-lg p-1.5 text-text-muted hover:bg-warm-bg hover:text-on-background">✕</button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto px-6 py-5">

                    {/* Status/Priority Banner */}
                    <div className="mb-6 flex items-center justify-between rounded-xl bg-gray-50 p-4 ring-1 ring-outline">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Status</span>
                            <StatusBadge status={request.status} />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Priority</span>
                            <PriorityBadge priority={request.priority} />
                        </div>
                    </div>

                    {/* Data List */}
                    <div className="rounded-xl border border-outline bg-white px-4">
                        <InfoRow label="Request ID" value={<span className="font-mono text-xs">{request.requestId}</span>} truncate />
                        <InfoRow label="Created On" value={formatDateFull(request.createdAt)} />
                        {request.updatedAt !== request.createdAt && (
                            <InfoRow label="Last Updated" value={formatDateFull(request.updatedAt)} />
                        )}
                        <InfoRow label="Category" value={`${request.requestType} / ${request.category}`} />
                        <InfoRow label="Elderly User" value={
                            <div className="text-right">
                                <div>{request.elderlyName}</div>
                                <div className="text-xs font-normal text-text-muted">{request.elderlyCity}</div>
                            </div>
                        } />
                        <InfoRow label="Description" value={
                            <div className="text-right">
                                <div>{request.title}</div>
                                {request.description && request.description !== request.title && (
                                    <div className="mt-1 text-xs font-normal text-text-muted">{request.description}</div>
                                )}
                            </div>
                        } />
                        <InfoRow label="Assigned To" value={
                            request.assignedAgentId ? (
                                <span className="text-primary">{request.assignedAgentName}</span>
                            ) : (
                                <span className="italic text-text-muted">Unassigned</span>
                            )
                        } />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex shrink-0 gap-3 border-t border-outline bg-warm-bg px-6 py-4">
                    <button type="button" onClick={onClose}
                        className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-secondary ring-1 ring-outline hover:bg-gray-100">
                        {request.status === 'PENDING' ? 'Cancel' : 'Close'}
                    </button>
                    {!request.assignedAgentId && request.status !== 'REJECTED' && request.status !== 'COMPLETED' && (
                        <button type="button" onClick={onAssignAgent}
                            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            Assign Agent
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
