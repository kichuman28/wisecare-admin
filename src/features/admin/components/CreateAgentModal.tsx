import { useState, type FormEvent } from 'react';
import { useCreateAgent } from '../admin.hooks';
import type { CreateAgentResponse } from '../admin.types';

interface CreateAgentModalProps {
    onClose: () => void;
}

export function CreateAgentModal({ onClose }: CreateAgentModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [result, setResult] = useState<CreateAgentResponse | null>(null);

    const mutation = useCreateAgent();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !phone.trim() || !city.trim()) return;
        try {
            const data = await mutation.mutateAsync({
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                city: city.trim(),
            });
            setResult(data);
        } catch {
            // handled by React Query
        }
    };

    const inputClasses = 'block w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md animate-[fadeIn_200ms_ease-out] rounded-2xl bg-card-surface shadow-2xl ring-1 ring-outline">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline px-6 py-4">
                    <h2 className="text-lg font-bold text-on-background">Create Agent</h2>
                    <button type="button" onClick={onClose}
                        className="rounded-lg p-1.5 text-text-muted hover:bg-warm-bg hover:text-on-background">✕</button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    {result ? (
                        /* Success state */
                        <div className="space-y-4 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl">✓</div>
                            <div>
                                <p className="font-semibold text-on-background">{result.name} created</p>
                                <p className="mt-1 text-sm text-text-muted">{result.email}</p>
                            </div>
                            <div className="rounded-lg bg-amber-50 p-4 text-left">
                                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Default Password</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <code className="flex-1 rounded-lg bg-white px-3 py-2 font-mono text-sm">{result.defaultPassword}</code>
                                    <button type="button"
                                        onClick={() => navigator.clipboard.writeText(result.defaultPassword)}
                                        className="shrink-0 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
                                        Copy
                                    </button>
                                </div>
                                <p className="mt-2 text-xs text-amber-600">{result.message}</p>
                            </div>
                            <button type="button" onClick={onClose}
                                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
                                Done
                            </button>
                        </div>
                    ) : (
                        /* Form */
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mutation.isError && (
                                <div className="rounded-lg bg-error-light px-4 py-3 text-sm text-error">
                                    Failed to create agent. Please try again.
                                </div>
                            )}
                            <div>
                                <label htmlFor="agent-name" className="mb-1 block text-sm font-medium text-on-background">Name</label>
                                <input id="agent-name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                    className={inputClasses} placeholder="Priya Sharma" />
                            </div>
                            <div>
                                <label htmlFor="agent-email" className="mb-1 block text-sm font-medium text-on-background">Email</label>
                                <input id="agent-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                    className={inputClasses} placeholder="priya@wisecare.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="agent-phone" className="mb-1 block text-sm font-medium text-on-background">Phone</label>
                                    <input id="agent-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                                        className={inputClasses} placeholder="+91..." />
                                </div>
                                <div>
                                    <label htmlFor="agent-city" className="mb-1 block text-sm font-medium text-on-background">City</label>
                                    <input id="agent-city" type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                                        className={inputClasses} placeholder="Chennai" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={onClose}
                                    className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-secondary ring-1 ring-outline hover:bg-warm-bg">
                                    Cancel
                                </button>
                                <button type="submit" disabled={mutation.isPending}
                                    className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover disabled:opacity-50">
                                    {mutation.isPending ? 'Creating…' : 'Create Agent'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
