import { useState, useMemo } from 'react';
import type { ServiceRequest, AvailableAgent } from '../admin.types';
import { useAvailableAgents, useAssignAgent } from '../admin.hooks';
import { AgentCard, LoadingState, EmptyState } from '@/shared/components';

// ---------------------------------------------------------------------------
// AssignAgentModal
// ---------------------------------------------------------------------------

interface AssignAgentModalProps {
    request: ServiceRequest;
    onClose: () => void;
}

export function AssignAgentModal({ request, onClose }: AssignAgentModalProps) {
    const { data, isLoading } = useAvailableAgents();
    const assignMutation = useAssignAgent();
    const [selectedAgent, setSelectedAgent] = useState<AvailableAgent | null>(null);

    const filteredAgents = useMemo(() => {
        if (!data?.agents) return [];
        return data.agents.filter(
            (a) => a.city.toLowerCase() === request.elderlyCity.toLowerCase(),
        );
    }, [data, request.elderlyCity]);

    const allAgents = data?.agents ?? [];

    const handleAssign = async () => {
        if (!selectedAgent) return;
        try {
            await assignMutation.mutateAsync({
                requestId: request.requestId,
                data: { agentId: selectedAgent.agentUserId },
            });
            onClose();
        } catch {
            // Error is handled by React Query
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-lg animate-[fadeIn_200ms_ease-out] rounded-2xl bg-card-surface shadow-2xl ring-1 ring-outline">
                {/* Header */}
                <div className="border-b border-outline px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-on-background">
                                Assign Agent
                            </h2>
                            <p className="mt-0.5 text-sm text-text-muted">
                                {request.title} — {request.elderlyName} ({request.elderlyCity})
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-warm-bg hover:text-on-background"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="max-h-[400px] overflow-y-auto px-6 py-4">
                    {isLoading ? (
                        <LoadingState message="Loading available agents…" />
                    ) : filteredAgents.length === 0 && allAgents.length === 0 ? (
                        <EmptyState
                            title="No agents available"
                            description="There are no agents currently available for assignment."
                            icon="🚫"
                        />
                    ) : (
                        <>
                            {/* City-filtered agents */}
                            {filteredAgents.length > 0 && (
                                <div className="mb-4">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Agents in {request.elderlyCity}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {filteredAgents.map((agent) => (
                                            <AgentCard
                                                key={agent.agentUserId}
                                                agent={agent}
                                                selected={selectedAgent?.agentUserId === agent.agentUserId}
                                                onSelect={setSelectedAgent}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Other agents */}
                            {filteredAgents.length < allAgents.length && (
                                <div>
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        {filteredAgents.length > 0
                                            ? 'Other agents'
                                            : `No agents in ${request.elderlyCity} — showing all`}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {allAgents
                                            .filter(
                                                (a) =>
                                                    a.city.toLowerCase() !==
                                                    request.elderlyCity.toLowerCase(),
                                            )
                                            .map((agent) => (
                                                <AgentCard
                                                    key={agent.agentUserId}
                                                    agent={agent}
                                                    selected={
                                                        selectedAgent?.agentUserId ===
                                                        agent.agentUserId
                                                    }
                                                    onSelect={setSelectedAgent}
                                                />
                                            ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-outline px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-warm-bg"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!selectedAgent || assignMutation.isPending}
                        onClick={handleAssign}
                        className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {assignMutation.isPending ? 'Assigning…' : 'Confirm Assignment'}
                    </button>
                </div>
            </div>
        </div>
    );
}
