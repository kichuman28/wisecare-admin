import { useState } from 'react';
import { useWallet, useWalletTransactions, useTopUpWallet } from '../family.hooks';
import { LoadingState } from '@/shared/components';

export function WalletWidget({ elderlyUserId }: { elderlyUserId: string }) {
    const { data: wallet, isLoading: walletLoading } = useWallet(elderlyUserId);
    const { data: transData, isLoading: transLoading } = useWalletTransactions(elderlyUserId, { limit: 5 });
    const topUpMutation = useTopUpWallet(elderlyUserId);

    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [amount, setAmount] = useState('1000');

    if (walletLoading || transLoading) {
        return (
            <div className="glass-panel glass-card-hover rounded-2xl p-6 min-h-[250px] flex items-center justify-center">
                <LoadingState message="Loading wallet..." />
            </div>
        );
    }

    if (!wallet) return null;

    const transactions = transData?.transactions || [];
    const limitPercentage = Math.min((wallet.monthlySpent / wallet.monthlyLimit) * 100, 100);

    const handleTopUp = () => {
        const value = parseFloat(amount);
        if (value > 0) {
            topUpMutation.mutate({ amount: value, notes: 'Family Dashboard Top Up' }, {
                onSuccess: () => {
                    setIsTopUpOpen(false);
                    setAmount('1000');
                }
            });
        }
    };

    return (
        <div className="glass-panel glass-card-hover flex flex-col rounded-2xl p-6 relative overflow-hidden h-full">
            {/* Background design */}
            <div className="absolute top-0 right-0 w-full h-24 bg-gradient-to-br from-navy to-gradient-bottom -z-10 rounded-b-3xl shadow-inner"></div>

            <div className="flex items-center justify-between mb-4 z-10 text-white">
                <h2 className="text-lg font-extrabold tracking-tight">Wallet & Expenses</h2>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-outline/50 mt-2 z-10">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Available Balance</p>
                <div className="flex items-end justify-between">
                    <p className="text-3xl font-extrabold text-navy">
                        {wallet.balance.toLocaleString('en-IN', { style: 'currency', currency: wallet.currency, maximumFractionDigits: 0 })}
                    </p>
                    <button
                        onClick={() => setIsTopUpOpen(true)}
                        className="rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm"
                    >
                        + Top Up
                    </button>
                </div>

                <div className="mt-5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-text-muted">Monthly Usage</span>
                        <span className="font-bold text-navy">
                            {wallet.monthlySpent.toLocaleString('en-IN', { style: 'currency', currency: wallet.currency, maximumFractionDigits: 0 })}
                            <span className="text-text-muted font-normal text-[10px] ml-1">/ {wallet.monthlyLimit}</span>
                        </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-outline/30 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${limitPercentage > 80 ? 'bg-red-500' : limitPercentage > 50 ? 'bg-orange-400' : 'bg-primary'}`}
                            style={{ width: `${limitPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="mt-5 flex-1 min-h-0 flex flex-col">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Recent Transactions</h3>
                {transactions.length === 0 ? (
                    <p className="text-xs text-text-muted text-center py-4 bg-gray-50 rounded-xl">No recent transactions</p>
                ) : (
                    <div className="space-y-2 overflow-y-auto pr-1">
                        {transactions.map(t => (
                            <div key={t.transactionId} className="flex items-center justify-between border-b border-outline/50 pb-2 last:border-0 last:pb-0">
                                <div className="flex items-start gap-2">
                                    <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] items-center text-white font-bold ${t.type === 'CREDIT' ? 'bg-emerald-500' : 'bg-text-muted'}`}>
                                        {t.type === 'CREDIT' ? '↓' : '↑'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-on-background line-clamp-1">{t.description}</p>
                                        <p className="text-[10px] text-text-muted">{new Date(t.timestamp).toLocaleDateString()} · {t.category}</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-extrabold shrink-0 ${t.type === 'CREDIT' ? 'text-emerald-600' : 'text-on-background'}`}>
                                    {t.type === 'CREDIT' ? '+' : '-'}₹{t.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Top Up Modal Inline */}
            {isTopUpOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-navy/20 backdrop-blur-sm animate-fade-in-up">
                    <div className="w-[90%] rounded-2xl bg-white p-5 shadow-xl ring-1 ring-outline/50 transform scale-100 transition-transform">
                        <h3 className="text-lg font-extrabold text-navy mb-3">Top Up Wallet</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1 block">Amount (₹)</label>
                                <input
                                    type="number"
                                    min="100"
                                    step="100"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full rounded-xl border border-outline bg-gray-50 px-4 py-2 text-sm font-bold text-navy focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setAmount('500')}
                                    className="flex-1 rounded-lg border border-outline/50 bg-gray-50 py-1.5 text-xs font-bold text-text-muted hover:bg-gray-100"
                                >
                                    +500
                                </button>
                                <button
                                    onClick={() => setAmount('1000')}
                                    className="flex-1 rounded-lg border border-outline/50 bg-gray-50 py-1.5 text-xs font-bold text-text-muted hover:bg-gray-100"
                                >
                                    +1000
                                </button>
                                <button
                                    onClick={() => setAmount('5000')}
                                    className="flex-1 rounded-lg border border-outline/50 bg-gray-50 py-1.5 text-xs font-bold text-text-muted hover:bg-gray-100"
                                >
                                    +5000
                                </button>
                            </div>

                            <button
                                onClick={handleTopUp}
                                disabled={topUpMutation.isPending || parseFloat(amount) <= 0}
                                className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-hover disabled:opacity-50 transition-all"
                            >
                                {topUpMutation.isPending ? 'Processing...' : `Pay ₹${amount} via UPI`}
                            </button>
                            <button
                                onClick={() => setIsTopUpOpen(false)}
                                className="w-full py-2 text-xs font-bold text-text-muted hover:text-navy"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
