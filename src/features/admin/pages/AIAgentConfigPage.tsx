import { useAIAgentConfig, useToggleCategory } from '../admin.hooks';
import { LoadingState, SettingsIcon } from '@/shared/components';
import type { CategoryConfig } from '../admin.types';

// ---------------------------------------------------------------------------
// Category Config Card
// ---------------------------------------------------------------------------

function CategoryCard({
    category,
    config,
    onToggle,
}: {
    category: string;
    config: CategoryConfig;
    onToggle: (category: string, enabled: boolean) => void;
}) {

    return (
        <div className={`rounded-xl border bg-card-surface p-5 transition-colors ${config.enabled ? 'border-primary/20 shadow-sm' : 'border-outline opacity-75'}`}>
            <div className="mb-4 flex items-center justify-between border-b border-outline pb-4">
                <h3 className="font-semibold text-on-background">{category}</h3>

                {/* Toggle switch */}
                <button
                    type="button"
                    role="switch"
                    aria-checked={config.enabled}
                    onClick={() => onToggle(category, !config.enabled)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${config.enabled ? 'bg-primary' : 'bg-gray-200'}`}
                >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">Auto-Approve Under</span>
                    <span className="font-mono text-sm font-bold text-green-600">₹{config.autoApprovalLimit}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">Require Approval Above</span>
                    <span className="font-mono text-sm font-bold text-amber-600">₹{config.requireApprovalAbove}</span>
                </div>

                <div className="pt-2">
                    <p className="mb-2 text-xs text-text-muted">Escalation Triggers:</p>
                    <div className="flex flex-wrap gap-1">
                        {config.escalationTriggers?.map(trigger => (
                            <span key={trigger} className="rounded bg-red-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-red-600 border border-red-100">
                                {trigger.replace(/_/g, ' ')}
                            </span>
                        ))}
                        {(!config.escalationTriggers || config.escalationTriggers.length === 0) && (
                            <span className="text-xs italic text-gray-400">None</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export function AIAgentConfigPage() {
    const { data: response, isLoading } = useAIAgentConfig();
    const config = response?.config;

    const toggleCategoryMutation = useToggleCategory();

    const handleToggleCategory = (category: string, enabled: boolean) => {
        toggleCategoryMutation.mutate({ category, data: { enabled } });
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <LoadingState message="Loading AI agent configuration..." />
            </div>
        );
    }

    if (!config) {
        return (
            <div className="py-12 text-center text-text-muted">
                Failed to load configuration.
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-gradient-bottom shadow-sm">
                    <SettingsIcon size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-on-background">AI Agent Config</h1>
                    <p className="text-sm text-text-muted">Manage global AI behavior, budget limits, and working hours.</p>
                </div>
            </div>

            {/* Categories Grid */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-on-background">Category Controls</h2>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {response.summary?.enabledCategories} of {response.summary?.totalCategories} enabled
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(config.categories).map(([category, catConfig]) => (
                        <CategoryCard
                            key={category}
                            category={category}
                            config={catConfig}
                            onToggle={handleToggleCategory}
                        />
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Working Hours */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-on-background">Working Hours & Policy</h2>
                    <div className="rounded-xl border border-outline bg-card-surface p-5">
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-outline pb-3">
                                <span className="text-sm font-medium text-text-muted">AI Agent Status</span>
                                <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">{config.workingHours.aiAgent}</span>
                            </div>
                            <div className="flex justify-between border-b border-outline pb-3">
                                <span className="text-sm font-medium text-text-muted">Human Agents</span>
                                <span className="font-mono text-sm text-on-background">{config.workingHours.humanAgents.start} - {config.workingHours.humanAgents.end}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-text-muted">After-Hours Policy</span>
                                <span className="rounded bg-navy px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">{config.workingHours.afterHoursPolicy.replace(/_/g, ' ')}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Global Budget Limits */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-on-background">Default Budget Limits</h2>
                    <div className="rounded-xl border border-outline bg-card-surface p-5">
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-text-muted">Per User (Default)</h3>
                        <div className="flex gap-4">
                            <div className="flex-1 rounded-lg bg-gray-50 p-3">
                                <p className="text-xs text-text-muted">Daily Limit</p>
                                <p className="mt-1 font-mono text-lg font-bold text-on-background">₹{config.budgetLimits.perUser.daily}</p>
                            </div>
                            <div className="flex-1 rounded-lg bg-gray-50 p-3">
                                <p className="text-xs text-text-muted">Monthly Limit</p>
                                <p className="mt-1 font-mono text-lg font-bold text-on-background">₹{config.budgetLimits.perUser.monthly}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div className="text-right text-xs text-gray-400">Config Version: {config.version}</div>
        </div>
    );
}
