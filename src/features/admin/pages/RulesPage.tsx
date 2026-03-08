import { useState } from 'react';
import { useRules, useToggleRule, useDeleteRule } from '../admin.hooks';
import { LoadingState, EmptyState, RulesIcon } from '@/shared/components';
import type { Rule, RuleCategory, RuleType, RulesFilters } from '../admin.types';

import { RuleFormModal } from '../components/RuleFormModal';
import { RuleTestModal } from '../components/RuleTestModal';

// ---------------------------------------------------------------------------
// Rule Card Component
// ---------------------------------------------------------------------------

function RuleCard({
    rule,
    onToggle,
    onDelete,
    onEdit,
    onTest,
}: {
    rule: Rule;
    onToggle: (id: string, current: boolean) => void;
    onDelete: (id: string) => void;
    onEdit: (rule: Rule) => void;
    onTest: (rule: Rule) => void;
}) {
    const isEnabled = String(rule.enabled) === 'true';

    return (
        <div className={`rounded-xl border bg-card-surface transition-colors ${isEnabled ? 'border-primary/20 shadow-sm' : 'border-outline opacity-75'}`}>
            <div className="flex items-start justify-between border-b border-outline p-4">
                <div className="min-w-0 pr-4 flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="truncate font-semibold text-on-background">{rule.name}</h3>
                        <span className="shrink-0 rounded bg-navy-dark px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
                            {rule.ruleType}
                        </span>
                        <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                            {rule.category}
                        </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-text-muted">{rule.description}</p>
                </div>

                {/* Toggle switch */}
                <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs font-medium text-text-muted">{isEnabled ? 'Enabled' : 'Disabled'}</span>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={isEnabled}
                        onClick={() => onToggle(rule.ruleId, isEnabled)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isEnabled ? 'bg-primary' : 'bg-gray-200'}`}
                    >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-medium text-text-muted">IF</span>
                    <span className="rounded bg-gray-100 px-2 py-1 font-mono">{rule.conditions?.field?.toString() ?? 'unknown'}</span>
                    <span className="font-medium text-primary">{rule.conditions?.operator?.replace(/_/g, ' ') ?? 'equals'}</span>
                    <span className="rounded bg-gray-100 px-2 py-1 font-mono font-bold">{String(rule.conditions?.value ?? '—')}</span>

                    <span className="ml-2 font-medium text-text-muted">THEN</span>
                    <span className={`rounded px-2 py-1 font-bold ${rule.action === 'AUTO_APPROVE' ? 'bg-green-100 text-green-700' :
                        rule.action === 'REJECT' ? 'bg-red-100 text-red-700' :
                            rule.action === 'ESCALATE' ? 'bg-orange-100 text-orange-700' :
                                'bg-blue-100 text-blue-700'
                        }`}>
                        {rule.action ? rule.action.replace(/_/g, ' ') : 'UNKNOWN'}
                    </span>
                </div>

                <div className="flex shrink-0 items-center gap-2 border-t border-outline pt-3 sm:border-0 sm:pt-0">
                    <button
                        onClick={() => onTest(rule)}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                    >
                        Test
                    </button>
                    <button
                        onClick={() => onEdit(rule)}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:bg-gray-100 hover:text-on-background"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('Delete this rule permanently?')) onDelete(rule.ruleId);
                        }}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export function RulesPage() {
    const [filters, setFilters] = useState<RulesFilters>({});
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<Rule | null>(null);
    const [testingRule, setTestingRule] = useState<Rule | null>(null);

    const { data, isLoading } = useRules(filters);

    const toggleRuleMutation = useToggleRule();
    const deleteRuleMutation = useDeleteRule();

    const rules = data?.rules ?? [];

    const handleToggle = (ruleId: string, current: boolean) => {
        toggleRuleMutation.mutate({ ruleId, data: { enabled: !current } });
    };

    const handleDelete = (ruleId: string) => {
        deleteRuleMutation.mutate(ruleId);
    };

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-gradient-bottom shadow-sm">
                        <RulesIcon size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-on-background">Rules Engine</h1>
                        <p className="text-sm text-text-muted">Configure AI agent behavior without code changes.</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    + Create Rule
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-outline bg-card-surface p-4">
                <select
                    className="rounded-lg border border-outline bg-transparent px-3 py-1.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    value={filters.category ?? ''}
                    onChange={(e) => setFilters(f => ({ ...f, category: e.target.value as RuleCategory || undefined }))}
                >
                    <option value="">All Categories</option>
                    <option value="GROCERY">Grocery</option>
                    <option value="MEDICINE">Medicine</option>
                    <option value="FOOD">Food</option>
                    <option value="DOCTOR">Doctor</option>
                    <option value="ALL">Global (All)</option>
                </select>

                <select
                    className="rounded-lg border border-outline bg-transparent px-3 py-1.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    value={filters.ruleType ?? ''}
                    onChange={(e) => setFilters(f => ({ ...f, ruleType: e.target.value as RuleType || undefined }))}
                >
                    <option value="">All Rule Types</option>
                    <option value="APPROVAL">Approval</option>
                    <option value="BUDGET">Budget</option>
                    <option value="ESCALATION">Escalation</option>
                </select>

                <select
                    className="rounded-lg border border-outline bg-transparent px-3 py-1.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    value={filters.enabled === undefined ? '' : String(filters.enabled)}
                    onChange={(e) => {
                        const val = e.target.value;
                        setFilters(f => ({ ...f, enabled: val === '' ? undefined : val === 'true' }));
                    }}
                >
                    <option value="">Any Status</option>
                    <option value="true">Enabled Only</option>
                    <option value="false">Disabled Only</option>
                </select>

                {Object.keys(filters).length > 0 && (
                    <button
                        onClick={() => setFilters({})}
                        className="text-xs font-semibold text-text-muted hover:text-primary"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* List */}
            {isLoading ? (
                <div className="py-12">
                    <LoadingState message="Loading rules..." />
                </div>
            ) : rules.length === 0 ? (
                <EmptyState
                    icon="📝"
                    title="No rules found"
                    description="There are no rules matching your criteria. Create a new rule to govern the AI agent."
                />
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {rules.map((rule) => (
                        <RuleCard
                            key={rule.ruleId}
                            rule={rule}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                            onEdit={() => setEditingRule(rule)}
                            onTest={() => setTestingRule(rule)}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            {isCreateOpen && (
                <RuleFormModal onClose={() => setIsCreateOpen(false)} />
            )}
            {editingRule && (
                <RuleFormModal initialData={editingRule} onClose={() => setEditingRule(null)} />
            )}
            {testingRule && (
                <RuleTestModal rule={testingRule} onClose={() => setTestingRule(null)} />
            )}
        </div>
    );
}
