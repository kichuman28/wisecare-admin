import type { AvailableAgent } from '@/features/admin/admin.types';

interface AgentCardProps {
    agent: AvailableAgent;
    selected?: boolean;
    onSelect: (agent: AvailableAgent) => void;
}

export function AgentCard({ agent, selected, onSelect }: AgentCardProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(agent)}
            className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${selected
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
        >
            {/* Avatar placeholder */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                {agent.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">
                    {agent.name}
                </p>
                <p className="text-xs text-gray-500">{agent.city}</p>
            </div>

            {/* Stats */}
            <div className="flex shrink-0 flex-col items-end gap-0.5">
                <span className="flex items-center gap-1 text-sm font-medium text-amber-600">
                    ★ {agent.rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">
                    {agent.completedTasks} tasks
                </span>
            </div>
        </button>
    );
}
