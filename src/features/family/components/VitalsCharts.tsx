import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { VitalReading } from '../family.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(ts: string) {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(ts: string) {
    const d = new Date(ts);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ---------------------------------------------------------------------------
// Heart Rate Chart
// ---------------------------------------------------------------------------

export function HeartRateChart({ items }: { items: VitalReading[] }) {
    const data = [...items]
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map(v => ({
            time: formatTime(v.timestamp),
            date: formatDate(v.timestamp),
            hr: Math.round(v.heartRate),
        }));

    return (
        <div className="glass-panel glass-card-hover flex h-[320px] flex-col rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-base font-extrabold tracking-tight text-on-background">Heart Rate</h3>
                    <p className="text-xs text-text-muted">Last {items.length} readings · BPM</p>
                </div>
                {data.length > 0 && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
                        ❤️ {data[data.length - 1].hr} bpm
                    </span>
                )}
            </div>
            <div className="flex-1 min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FF6933" stopOpacity={0.35} />
                                <stop offset="100%" stopColor="#FF6933" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#63504B', fontSize: 11 }} />
                        <YAxis domain={[40, 140]} axisLine={false} tickLine={false} tick={{ fill: '#63504B', fontSize: 11 }} />
                        <ReferenceLine y={120} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'High', fill: '#EF4444', fontSize: 10 }} />
                        <ReferenceLine y={50} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Low', fill: '#EF4444', fontSize: 10 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F234D', borderRadius: '12px', border: 'none',
                                color: '#fff', fontSize: '13px', fontWeight: 600, padding: '8px 14px',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                            }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}
                        />
                        <Area
                            type="monotone" dataKey="hr" name="Heart Rate"
                            stroke="#FF6933" strokeWidth={3}
                            fill="url(#hrGrad)" fillOpacity={1}
                            dot={{ r: 4, fill: '#FF6933', stroke: '#fff', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#FF6933', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Blood Pressure Chart
// ---------------------------------------------------------------------------

export function BloodPressureChart({ items }: { items: VitalReading[] }) {
    const data = [...items]
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map(v => ({
            time: formatTime(v.timestamp),
            date: formatDate(v.timestamp),
            sys: Math.round(v.bpSystolic),
            dia: Math.round(v.bpDiastolic),
        }));

    return (
        <div className="glass-panel glass-card-hover flex h-[320px] flex-col rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-base font-extrabold tracking-tight text-on-background">Blood Pressure</h3>
                    <p className="text-xs text-text-muted">Systolic / Diastolic · mmHg</p>
                </div>
                {data.length > 0 && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">
                        🩺 {data[data.length - 1].sys}/{data[data.length - 1].dia}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-4 mb-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#60A5FA]" /> Systolic
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#A78BFA]" /> Diastolic
                </span>
            </div>
            <div className="flex-1 min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="sysGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="diaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#63504B', fontSize: 11 }} />
                        <YAxis domain={[50, 180]} axisLine={false} tickLine={false} tick={{ fill: '#63504B', fontSize: 11 }} />
                        <ReferenceLine y={160} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Danger', fill: '#EF4444', fontSize: 10 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F234D', borderRadius: '12px', border: 'none',
                                color: '#fff', fontSize: '13px', fontWeight: 600, padding: '8px 14px',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                            }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}
                        />
                        <Area
                            type="monotone" dataKey="sys" name="Systolic"
                            stroke="#60A5FA" strokeWidth={3}
                            fill="url(#sysGrad)" fillOpacity={1}
                            dot={{ r: 4, fill: '#60A5FA', stroke: '#fff', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#60A5FA', stroke: '#fff', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone" dataKey="dia" name="Diastolic"
                            stroke="#A78BFA" strokeWidth={3}
                            fill="url(#diaGrad)" fillOpacity={1}
                            dot={{ r: 4, fill: '#A78BFA', stroke: '#fff', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#A78BFA', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
