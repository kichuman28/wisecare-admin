// ---------------------------------------------------------------------------
// Service Request types
// ---------------------------------------------------------------------------

export type ServiceRequestStatus =
    | 'PENDING'
    | 'ASSIGNED'
    | 'ACCEPTED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'REJECTED';

export type ServiceRequestPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type RequestType = 'DELIVERY' | 'APPOINTMENT' | 'ERRAND' | 'OTHER';

export type RequestCategory =
    | 'GROCERY'
    | 'PHARMACY'
    | 'MEDICAL'
    | 'GENERAL'
    | 'OTHER';

export interface ServiceRequest {
    requestId: string;
    elderlyUserId: string;
    elderlyName: string;
    elderlyCity: string;
    requestType: RequestType;
    category: RequestCategory;
    title: string;
    description: string;
    status: ServiceRequestStatus;
    priority: ServiceRequestPriority;
    assignedAgentId: string | null;
    assignedAgentName: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceRequestsResponse {
    requests: ServiceRequest[];
}

// ---------------------------------------------------------------------------
// Agent types
// ---------------------------------------------------------------------------

export type AgentStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export interface AvailableAgent {
    agentUserId: string;
    name: string;
    city: string;
    status: AgentStatus;
    completedTasks: number;
    rating: number;
}

export interface AvailableAgentsResponse {
    agents: AvailableAgent[];
}

// ---------------------------------------------------------------------------
// Assign agent
// ---------------------------------------------------------------------------

export interface AssignAgentRequest {
    agentId: string;
}

export interface AssignAgentResponse {
    success: boolean;
    requestId: string;
    assignedAgentId: string;
    status: 'ASSIGNED';
}

// ---------------------------------------------------------------------------
// Alert types
// ---------------------------------------------------------------------------

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type AlertType =
    | 'FALL_DETECTED'
    | 'MEDICATION_MISSED'
    | 'HEALTH_ANOMALY'
    | 'SOS'
    | 'OTHER';

export interface Alert {
    alertId: string;
    type: AlertType;
    severity: AlertSeverity;
    message: string;
    timestamp: string;
    resolved: boolean;
}

export interface ElderlyAlertGroup {
    elderlyUserId: string;
    elderlyName: string;
    alerts: Alert[];
}

export interface ResolveAlertRequest {
    resolvedBy: string;
}

// ---------------------------------------------------------------------------
// Status / Priority color maps (used by badge components)
// ---------------------------------------------------------------------------

export const STATUS_COLORS: Record<ServiceRequestStatus, string> = {
    PENDING: 'amber',
    ASSIGNED: 'blue',
    ACCEPTED: 'purple',
    IN_PROGRESS: 'orange',
    COMPLETED: 'green',
    REJECTED: 'red',
};

export const PRIORITY_COLORS: Record<ServiceRequestPriority, string> = {
    LOW: 'gray',
    NORMAL: 'blue',
    HIGH: 'orange',
    URGENT: 'red',
};

export const SEVERITY_COLORS: Record<AlertSeverity, string> = {
    CRITICAL: 'red',
    WARNING: 'amber',
    INFO: 'blue',
};
