import type { AvailableAgent } from '@/features/admin/admin.types';
import { StarIcon } from './Icons';

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
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-outline bg-card-surface hover:border-primary/40'
                }`}
        >
            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy to-icon-shield text-sm font-bold text-white">
                {agent.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-on-background">
                    {agent.name}
                </p>
                <p className="text-xs text-text-muted">{agent.city}</p>
            </div>

            {/* Stats */}
            <div className="flex shrink-0 flex-col items-end gap-0.5">
                <span className="flex items-center gap-1 text-sm font-medium text-primary">
                    <StarIcon size={14} />
                    {Number(agent.rating).toFixed(1)}
                </span>
                <span className="text-xs text-text-muted">
                    {agent.completedTasks} tasks
                </span>
            </div>
        </button>
    );
}
