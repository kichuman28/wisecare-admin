import { useFamilyProfile, useElderlyServiceRequests } from '../family.hooks';
import { SosHistoryCard } from '../components/SosHistoryCard';
import { LoadingState } from '@/shared/components';
import type { ElderlyServiceRequest, ServiceRequestStatus } from '../family.types';

const STATUS_COLORS: Record<ServiceRequestStatus, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    ASSIGNED: 'bg-blue-100 text-blue-700',
    ACCEPTED: 'bg-purple-100 text-purple-700',
    IN_PROGRESS: 'bg-orange-100 text-orange-700',
    COMPLETED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-red-100 text-red-700',
};

function ServiceRequestCard({ req }: { req: ElderlyServiceRequest }) {
    return (
        <div className="glass-panel glass-card-hover group flex flex-col gap-3 rounded-xl p-4 transition-all duration-200">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg shadow-sm">
                        {req.category === 'GROCERY' ? '🛒' : req.category === 'MEDICINE' ? '💊' : req.category === 'FOOD' ? '🍱' :
                            req.category === 'DOCTOR' ? '🏥' : req.category === 'SOS' ? '🆘' : req.category === 'COMPANION' ? '🤝' :
                                req.category === 'TRANSPORT' ? '🚗' : '📋'}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold text-on-background">{req.title}</p>
                        <p className="text-xs font-semibold text-text-muted mt-0.5">
                            {req.category.replace(/_/g, ' ')}
                        </p>
                    </div>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[req.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {req.status.replace(/_/g, ' ')}
                </span>
            </div>

            {req.description && (
                <p className="text-sm text-text-muted pl-14">
                    {req.description}
                </p>
            )}

            {(req.assignedAgentName || req.createdAt) && (
                <div className="flex items-center justify-between text-xs text-text-muted pl-14 mt-1 border-t border-gray-100 pt-3">
                    {req.assignedAgentName ? <span>Agent: <b>{req.assignedAgentName}</b></span> : <span>Unassigned</span>}
                    {req.createdAt && <span>{new Date(req.createdAt).toLocaleDateString()}</span>}
                </div>
            )}
        </div>
    );
}

export function FamilyServiceRequestsPage() {
    const { data: profile, isLoading: profileLoading } = useFamilyProfile();
    const elderlyId = profile?.linkedElderlyIds?.[0];

    const { data: requestsData, isLoading: requestsLoading } = useElderlyServiceRequests(elderlyId);

    if (profileLoading || requestsLoading) return <LoadingState message="Loading..." />;
    if (!elderlyId) return null;

    return (
        <div className="space-y-6 pb-12 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-on-background">
                        Service Requests
                    </h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Track requests and view emergency events.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Active/Past Requests */}
                <div className="lg:col-span-2 space-y-4">
                    {!requestsData || requestsData.requests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center flex-1 bg-white/40 rounded-2xl border border-gray-100">
                            <span className="mb-2 text-4xl opacity-50">📋</span>
                            <p className="text-sm font-medium text-text-muted">No service requests placed yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {requestsData.requests.map(r => (
                                <ServiceRequestCard key={r.requestId} req={r} />
                            ))}
                        </div>
                    )}
                </div>

                {/* SOS History Widget */}
                <div className="lg:col-span-1">
                    <SosHistoryCard elderlyUserId={elderlyId} />
                </div>
            </div>
        </div>
    );
}
