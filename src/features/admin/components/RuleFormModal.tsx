import { useState, type FormEvent, useEffect } from 'react';
import { useCreateRule, useUpdateRule } from '../admin.hooks';
import type {
    Rule,
    RuleCreateRequest,
    RuleUpdateRequest,
    RuleCategory,
    RuleType,
    RuleActionType,
    RuleOperator
} from '../admin.types';

interface RuleFormModalProps {
    initialData?: Rule | null;
    onClose: () => void;
}

const CATEGORIES: { value: RuleCategory; label: string }[] = [
    { value: 'GROCERY', label: 'Grocery' },
    { value: 'MEDICINE', label: 'Medicine' },
    { value: 'FOOD', label: 'Food' },
    { value: 'DOCTOR', label: 'Doctor Appointments' },
    { value: 'ALL', label: 'Global (All)' },
];

const RULE_TYPES: { value: RuleType; label: string }[] = [
    { value: 'APPROVAL', label: 'Approval Rule' },
    { value: 'BUDGET', label: 'Budget Rule' },
    { value: 'ESCALATION', label: 'Escalation Rule' },
];

const ACTIONS: { value: RuleActionType; label: string }[] = [
    { value: 'AUTO_APPROVE', label: 'Auto Approve' },
    { value: 'REQUIRE_APPROVAL', label: 'Require Manual Approval' },
    { value: 'ESCALATE', label: 'Escalate to Agent' },
    { value: 'REJECT', label: 'Reject Instantly' },
];

const OPERATORS: { value: RuleOperator; label: string }[] = [
    { value: 'EQUALS', label: 'Equals (==)' },
    { value: 'NOT_EQUALS', label: 'Not Equals (!=)' },
    { value: 'LESS_THAN', label: 'Less Than (<)' },
    { value: 'GREATER_THAN', label: 'Greater Than (>)' },
    { value: 'LESS_THAN_OR_EQUAL', label: 'Less Than or Equal (<=)' },
    { value: 'GREATER_THAN_OR_EQUAL', label: 'Greater Than or Equal (>=)' },
    { value: 'CONTAINS', label: 'Contains' },
    { value: 'NOT_CONTAINS', label: 'Does Not Contain' },
];

export function RuleFormModal({ initialData, onClose }: RuleFormModalProps) {
    const isEditing = !!initialData;

    // Form State
    const [name, setName] = useState(initialData?.name ?? '');
    const [description, setDescription] = useState(initialData?.description ?? '');
    const [category, setCategory] = useState<RuleCategory>(initialData?.category ?? 'ALL');
    const [ruleType, setRuleType] = useState<RuleType>(initialData?.ruleType ?? 'APPROVAL');
    const [priority, setPriority] = useState<string>(initialData?.priority?.toString() ?? '1');
    const [action, setAction] = useState<RuleActionType>(initialData?.action ?? 'AUTO_APPROVE');

    // Conditions State
    const [conditionField, setConditionField] = useState(initialData?.conditions?.field?.toString() ?? 'orderTotal');
    const [conditionOperator, setConditionOperator] = useState<RuleOperator>(initialData?.conditions?.operator ?? 'LESS_THAN');
    const [conditionValue, setConditionValue] = useState<string>(initialData?.conditions?.value?.toString() ?? '500');

    const createMutation = useCreateRule();
    const updateMutation = useUpdateRule();

    const isPending = createMutation.isPending || updateMutation.isPending;
    const isError = createMutation.isError || updateMutation.isError;

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Convert value string to proper type (number or string)
        let parsedValue: string | number = conditionValue;
        if (!isNaN(Number(conditionValue)) && conditionValue.trim() !== '') {
            parsedValue = Number(conditionValue);
        }

        const conditions = {
            field: conditionField,
            operator: conditionOperator,
            value: parsedValue,
        };

        try {
            if (isEditing) {
                const updatePayload: RuleUpdateRequest = {
                    name,
                    description,
                    priority: Number(priority),
                    conditions,
                    action,
                };
                await updateMutation.mutateAsync({ ruleId: initialData!.ruleId, data: updatePayload });
            } else {
                const createPayload: RuleCreateRequest = {
                    name,
                    description,
                    category,
                    ruleType,
                    priority: Number(priority),
                    conditions,
                    action,
                };
                await createMutation.mutateAsync(createPayload);
            }
            onClose();
        } catch {
            // Error managed by React Query
        }
    };

    const inputClasses = 'block w-full rounded-lg border border-outline bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:p-6" onClick={onClose}>
            <div
                className="flex w-full max-w-2xl animate-[fadeIn_200ms_ease-out] flex-col overflow-hidden rounded-2xl bg-card-surface shadow-2xl ring-1 ring-outline max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-outline px-6 py-4">
                    <h2 className="text-lg font-bold text-on-background">
                        {isEditing ? 'Edit Rule' : 'Create New Rule'}
                    </h2>
                    <button type="button" onClick={onClose}
                        className="rounded-lg p-1.5 text-text-muted hover:bg-warm-bg hover:text-on-background">✕</button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto px-6 py-5">
                    <form id="rule-form" onSubmit={handleSubmit} className="space-y-6">
                        {isError && (
                            <div className="rounded-lg bg-error-light px-4 py-3 text-sm text-error">
                                Failed to {isEditing ? 'update' : 'create'} rule. Please try again or check the inputs.
                            </div>
                        )}

                        {/* Summary Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-on-background">Basic Details</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label htmlFor="name" className="mb-1 block text-sm font-medium text-text-muted">Rule Name</label>
                                    <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                        className={inputClasses} placeholder="e.g. Auto-approve under $500" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="description" className="mb-1 block text-sm font-medium text-text-muted">Description</label>
                                    <textarea id="description" required value={description} onChange={(e) => setDescription(e.target.value)}
                                        className={inputClasses} rows={2} placeholder="Why does this rule exist?" />
                                </div>
                            </div>
                        </div>

                        {/* Configuration Section (Disabled in Edit Mode per API spec) */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-on-background">Configuration</h3>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label htmlFor="category" className="mb-1 block text-sm font-medium text-text-muted">Category</label>
                                    <select id="category" disabled={isEditing} value={category} onChange={(e) => setCategory(e.target.value as RuleCategory)}
                                        className={`${inputClasses} ${isEditing ? 'bg-gray-50 opacity-75' : ''}`}>
                                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="type" className="mb-1 block text-sm font-medium text-text-muted">Type</label>
                                    <select id="type" disabled={isEditing} value={ruleType} onChange={(e) => setRuleType(e.target.value as RuleType)}
                                        className={`${inputClasses} ${isEditing ? 'bg-gray-50 opacity-75' : ''}`}>
                                        {RULE_TYPES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="priority" className="mb-1 block text-sm font-medium text-text-muted">Priority (Lower = First)</label>
                                    <input id="priority" type="number" min="1" max="100" required value={priority} onChange={(e) => setPriority(e.target.value)}
                                        className={inputClasses} />
                                </div>
                            </div>
                        </div>

                        {/* Logic Section */}
                        <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                            <h3 className="text-sm font-semibold text-on-background">Rule Logic</h3>

                            {/* Condition */}
                            <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-outline">
                                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">If condition matches</p>
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div>
                                        <input type="text" value={conditionField} onChange={(e) => setConditionField(e.target.value)}
                                            className={inputClasses} placeholder="Field (e.g. orderTotal)" required />
                                    </div>
                                    <div>
                                        <select value={conditionOperator} onChange={(e) => setConditionOperator(e.target.value as RuleOperator)}
                                            className={inputClasses}>
                                            {OPERATORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <input type="text" value={conditionValue} onChange={(e) => setConditionValue(e.target.value)}
                                            className={inputClasses} placeholder="Value (e.g. 500)" required />
                                    </div>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-outline">
                                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">Then execute action</p>
                                <select value={action} onChange={(e) => setAction(e.target.value as RuleActionType)}
                                    className={inputClasses}>
                                    {ACTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Controls */}
                <div className="flex shrink-0 gap-3 border-t border-outline bg-warm-bg px-6 py-4">
                    <button type="button" onClick={onClose}
                        className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-secondary ring-1 ring-outline hover:bg-gray-100">
                        Cancel
                    </button>
                    <button type="submit" form="rule-form" disabled={isPending}
                        className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover disabled:opacity-50">
                        {isPending ? 'Saving…' : (isEditing ? 'Save Changes' : 'Create Rule')}
                    </button>
                </div>
            </div>
        </div>
    );
}
