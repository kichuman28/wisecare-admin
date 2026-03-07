import type { RiskResponse } from '../family.types';

const RISK_COLORS = {
    LOW: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200', stroke: '#34D399' },
    MEDIUM: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-200', stroke: '#FBBF24' },
    HIGH: { bg: 'bg-red-50', text: 'text-red-600', ring: 'ring-red-200', stroke: '#EF4444' },
};

export function RiskScoreCard({ data }: { data?: RiskResponse }) {
    if (!data) return null;

    const colors = RISK_COLORS[data.level] ?? RISK_COLORS.LOW;
    // SVG ring: circumference = 2 * PI * r = 2 * 3.14159 * 45 ≈ 282.74
    const circumference = 282.74;
    const progress = Math.min(data.score / 10, 1); // 0-10 scale
    const dashOffset = circumference * (1 - progress);

    return (
        <div className="glass-panel glass-card-hover flex flex-col rounded-2xl p-6">
            <h3 className="mb-1 text-base font-extrabold tracking-tight text-on-background">Health Risk</h3>
            <p className="text-xs text-text-muted">Based on alerts in last 24 hours</p>

            <div className="my-6 flex items-center justify-center">
                <div className="relative">
                    <svg width="140" height="140" viewBox="0 0 100 100" className="-rotate-90">
                        {/* Background ring */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
                        {/* Progress ring */}
                        <circle
                            cx="50" cy="50" r="45"
                            fill="none"
                            stroke={colors.stroke}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-extrabold ${colors.text}`}>{data.score}</span>
                        <span className="text-xs font-bold text-text-muted">/10</span>
                    </div>
                </div>
            </div>

            {/* Level badge */}
            <div className="mb-4 flex justify-center">
                <span className={`rounded-full px-4 py-1.5 text-sm font-bold ring-1 ${colors.bg} ${colors.text} ${colors.ring}`}>
                    {data.level} Risk
                </span>
            </div>

            {/* Risk factors */}
            {data.factors.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Contributing Factors</p>
                    {data.factors.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 rounded-lg bg-warm-bg px-3 py-2 text-sm text-on-background">
                            <span className="mt-0.5 text-primary">•</span>
                            {f}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
