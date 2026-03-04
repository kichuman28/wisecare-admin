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

    // Filter agents by elderly user's city
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
            // Error is handled by React Query — could add toast here
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-lg animate-[fadeIn_200ms_ease-out] rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Assign Agent
                            </h2>
                            <p className="mt-0.5 text-sm text-gray-500">
                                {request.title} — {request.elderlyName} ({request.elderlyCity})
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
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
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
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
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
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
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!selectedAgent || assignMutation.isPending}
                        onClick={handleAssign}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {assignMutation.isPending ? 'Assigning…' : 'Confirm Assignment'}
                    </button>
                </div>
            </div>
        </div>
    );
}
