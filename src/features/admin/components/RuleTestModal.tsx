import { useState, type FormEvent, useEffect } from 'react';
import { useTestRule } from '../admin.hooks';
import type { Rule, RuleTestResponse } from '../admin.types';

interface RuleTestModalProps {
    rule: Rule;
    onClose: () => void;
}

export function RuleTestModal({ rule, onClose }: RuleTestModalProps) {
    const defaultData = {
        [rule.conditions.field.toString()]: rule.conditions.value,
        category: rule.category
    };

    const [payloadJson, setPayloadJson] = useState(JSON.stringify(defaultData, null, 2));
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [result, setResult] = useState<RuleTestResponse | null>(null);

    const testMutation = useTestRule();

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
        setJsonError(null);
        setResult(null);

        let parsedData: Record<string, unknown> = {};
        try {
            parsedData = JSON.parse(payloadJson);
        } catch (err: any) {
            setJsonError(`Invalid JSON format: ${err.message}`);
            return;
        }

        try {
            const res = await testMutation.mutateAsync({
                ruleId: rule.ruleId,
                testData: parsedData,
            });
            setResult(res);
        } catch {
            // Handled by react query
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:p-6" onClick={onClose}>
            <div
                className="flex w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-card-surface shadow-2xl ring-1 ring-outline animate-[fadeIn_200ms_ease-out] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-outline px-6 py-4">
                    <h2 className="text-lg font-bold text-on-background">Test Rule: {rule.name}</h2>
                    <button type="button" onClick={onClose}
                        className="rounded-lg p-1.5 text-text-muted hover:bg-warm-bg hover:text-on-background">✕</button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto px-6 py-5">
                    <div className="mb-4 rounded-lg bg-gray-50 p-3 text-sm text-text-muted ring-1 ring-outline">
                        Evaluating condition: <strong className="font-mono text-primary">{rule.conditions.field.toString()} {rule.conditions.operator.replace(/_/g, ' ')} {rule.conditions.value.toString()}</strong>
                    </div>

                    <form id="test-rule-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="payload" className="mb-1 block text-sm font-medium text-text-muted">
                                Test Payload (JSON)
                            </label>
                            <textarea
                                id="payload"
                                required
                                rows={6}
                                value={payloadJson}
                                onChange={(e) => {
                                    setPayloadJson(e.target.value);
                                    if (jsonError) setJsonError(null);
                                }}
                                className={`block w-full rounded-lg border bg-white px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 ${jsonError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-outline focus:border-primary focus:ring-primary'
                                    }`}
                            />
                            {jsonError && <p className="mt-1 text-xs text-red-500">{jsonError}</p>}
                            {testMutation.isError && (
                                <p className="mt-1 text-xs text-error">Failed to call the test engine API. See console.</p>
                            )}
                        </div>

                        {/* Result Display */}
                        {result && (
                            <div className={`mt-6 space-y-3 rounded-xl border p-4 ${result.matched ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold ${result.matched ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {result.matched ? '✓' : '✕'}
                                    </div>
                                    <div>
                                        <p className={`font-bold ${result.matched ? 'text-green-800' : 'text-red-800'}`}>
                                            {result.matched ? 'Rule Matched' : 'Rule Checked (No Match)'}
                                        </p>
                                        <p className={`text-sm ${result.matched ? 'text-green-700' : 'text-red-700'}`}>
                                            Proposed Action: <strong>{result.action.replace(/_/g, ' ')}</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="flex shrink-0 gap-3 border-t border-outline bg-warm-bg px-6 py-4">
                    <button type="button" onClick={onClose}
                        className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-secondary ring-1 ring-outline hover:bg-gray-100">
                        Close
                    </button>
                    <button type="submit" form="test-rule-form" disabled={testMutation.isPending}
                        className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover disabled:opacity-50">
                        {testMutation.isPending ? 'Running...' : 'Run Test'}
                    </button>
                </div>
            </div>
        </div>
    );
}
