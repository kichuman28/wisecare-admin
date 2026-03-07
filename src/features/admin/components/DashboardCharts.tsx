import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import type { AdminStatsResponse } from '../admin.types';

// ---------------------------------------------------------------------------
// Helper: clean up ugly API category keys into readable labels
// ---------------------------------------------------------------------------

function cleanCategoryName(raw: string): string {
    // API returns things like "EMERGENCY_ASSISTANCE/SOS", "DELIVERY/GROCERY", etc.
    return raw
        .split('/').pop()!           // take last segment
        .split('_').join(' ')        // underscores to spaces
        .replace(/\b\w/g, c => c.toUpperCase()); // Title Case
}

// ---------------------------------------------------------------------------
// Mock 7-day trend (API only returns totals, not time-series)
// ---------------------------------------------------------------------------

const mockTrendData = [
    { name: 'Mon', requests: 12, alerts: 4 },
    { name: 'Tue', requests: 19, alerts: 3 },
    { name: 'Wed', requests: 15, alerts: 7 },
    { name: 'Thu', requests: 22, alerts: 2 },
    { name: 'Fri', requests: 28, alerts: 5 },
    { name: 'Sat', requests: 35, alerts: 8 },
    { name: 'Sun', requests: 42, alerts: 6 },
];

// ---------------------------------------------------------------------------
// Sweeping Area Chart — full width
// ---------------------------------------------------------------------------

export function ActivityAreaChart() {
    return (
        <div className="glass-panel glass-card-hover flex h-[400px] w-full flex-col rounded-2xl p-6">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-extrabold tracking-tight text-on-background">Weekly Activity Trend</h3>
                    <p className="mt-0.5 text-xs font-medium text-text-muted">Requests & alerts over the last 7 days</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#FF6933]" />
                        Requests
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#60A5FA]" />
                        Alerts
                    </span>
                </div>
            </div>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="gradRequests" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FF6933" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#FF6933" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="gradAlerts" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.35} />
                                <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#63504B', fontSize: 12, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#63504B', fontSize: 12, fontWeight: 500 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F234D',
                                borderRadius: '14px',
                                border: 'none',
                                color: '#fff',
                                fontSize: '13px',
                                fontWeight: 600,
                                boxShadow: '0 12px 32px -8px rgba(31,35,77,0.4)',
                                padding: '10px 16px',
                            }}
                            itemStyle={{ color: '#fff', fontWeight: 600, fontSize: '13px' }}
                            labelStyle={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, marginBottom: '4px' }}
                            cursor={{ stroke: '#FF6933', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="requests"
                            name="Requests"
                            stroke="#FF6933"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#gradRequests)"
                            dot={{ r: 4, fill: '#FF6933', stroke: '#fff', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#FF6933', stroke: '#fff', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="alerts"
                            name="Alerts"
                            stroke="#60A5FA"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#gradAlerts)"
                            dot={{ r: 4, fill: '#60A5FA', stroke: '#fff', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#60A5FA', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Category Horizontal Bar Chart — with cleaned-up labels
// ---------------------------------------------------------------------------

const COLORS = ['#FF6933', '#60A5FA', '#34D399', '#A78BFA', '#F472B6', '#FBBF24', '#4ADE80', '#FB923C'];

export function DistributionBarChart({ typeBreakdown }: { typeBreakdown?: Record<string, number> }) {
    const data = typeBreakdown && Object.keys(typeBreakdown).length > 0
        ? Object.entries(typeBreakdown).map(([key, value]) => ({
            name: cleanCategoryName(key),
            value
        }))
        : [
            { name: 'Grocery', value: 45 },
            { name: 'Medical', value: 30 },
            { name: 'Pharmacy', value: 25 },
            { name: 'Travel', value: 18 },
            { name: 'Other', value: 12 },
        ];

    data.sort((a, b) => b.value - a.value);

    return (
        <div className="glass-panel glass-card-hover flex h-[400px] w-full flex-col rounded-2xl p-6">
            <div className="mb-5">
                <h3 className="text-lg font-extrabold tracking-tight text-on-background">Request Categories</h3>
                <p className="mt-0.5 text-xs font-medium text-text-muted">Distribution by service type</p>
            </div>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.06)" />
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#1C1B1F', fontSize: 12, fontWeight: 600 }}
                            width={110}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,105,51,0.06)' }}
                            contentStyle={{
                                backgroundColor: '#1F234D',
                                borderRadius: '14px',
                                border: 'none',
                                color: '#fff',
                                fontSize: '13px',
                                fontWeight: 600,
                                boxShadow: '0 12px 32px -8px rgba(31,35,77,0.4)',
                                padding: '10px 16px',
                            }}
                            itemStyle={{ color: '#fff', fontWeight: 600, fontSize: '13px' }}
                        />
                        <Bar dataKey="value" name="Requests" radius={[0, 10, 10, 0]} barSize={22}>
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// User Distribution Donut Chart
// ---------------------------------------------------------------------------

export function UserDistributionChart({ users }: { users?: AdminStatsResponse['users'] }) {
    const data = users
        ? [
            { name: 'Elderly', value: users.elderly, color: '#FF6933' },
            { name: 'Family', value: users.family, color: '#60A5FA' },
            { name: 'Agents', value: users.agents, color: '#34D399' },
        ]
        : [
            { name: 'Elderly', value: 51, color: '#FF6933' },
            { name: 'Family', value: 23, color: '#60A5FA' },
            { name: 'Agents', value: 9, color: '#34D399' },
        ];

    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="glass-panel glass-card-hover flex h-[400px] w-full flex-col rounded-2xl p-6">
            <div className="mb-5">
                <h3 className="text-lg font-extrabold tracking-tight text-on-background">User Distribution</h3>
                <p className="mt-0.5 text-xs font-medium text-text-muted">Breakdown by role type</p>
            </div>
            <div className="flex flex-1 items-center justify-center">
                <div className="relative">
                    <ResponsiveContainer width={200} height={200}>
                        <PieChart>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F234D',
                                    borderRadius: '14px',
                                    border: 'none',
                                    color: '#fff',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    boxShadow: '0 12px 32px -8px rgba(31,35,77,0.4)',
                                    padding: '10px 16px',
                                }}
                                itemStyle={{ color: '#fff', fontWeight: 600 }}
                            />
                            <Pie
                                data={data}
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-3xl font-extrabold text-on-background">{total}</p>
                        <p className="text-xs font-semibold text-text-muted">Total</p>
                    </div>
                </div>
            </div>
            {/* Legend */}
            <div className="mt-4 flex justify-center gap-5">
                {data.map(d => (
                    <div key={d.name} className="flex items-center gap-2 text-sm">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="font-semibold text-on-background">{d.value}</span>
                        <span className="text-text-muted">{d.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
