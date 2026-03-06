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
    | 'MEDICINE'
    | 'FOOD'
    | 'DOCTOR'
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
    phone?: string;
    city: string;
    status: AgentStatus;
    completedTasks: number;
    rating: number;
}

export interface AvailableAgentsResponse {
    agents: AvailableAgent[];
    count?: number;
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
// Admin Stats (GET /admin/stats)
// ---------------------------------------------------------------------------

export interface AdminStatsResponse {
    generatedAt: string;
    users: {
        total: number;
        elderly: number;
        family: number;
        agents: number;
    };
    serviceRequests: {
        pending: number;
        assigned: number;
        inProgress: number;
        completedToday: number;
        totalCompleted: number;
        rejected: number;
        total: number;
        typeBreakdown: Record<string, number>;
    };
    alerts: {
        totalUnresolved: number;
        critical: number;
        high: number;
        companionFlags: number;
        fallDetected: number;
    };
    recentRequests: {
        requestId: string;
        elderlyName: string;
        title: string;
        status: ServiceRequestStatus;
        createdAt: string;
    }[];
    recentAlerts: {
        alertId: string;
        userId: string;
        type: string;
        severity: string;
        message: string;
        timestamp: string;
    }[];
}

// ---------------------------------------------------------------------------
// Alert types (GET /admin/alerts)
// ---------------------------------------------------------------------------

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'WARNING' | 'INFO';

export type AlertType =
    | 'FALL_DETECTED'
    | 'HIGH_BP'
    | 'COMPANION_CONCERN'
    | 'SOS'
    | 'MEDICATION_MISSED'
    | 'HEALTH_ANOMALY'
    | 'OTHER';

export interface Alert {
    alertId: string;
    userId?: string;
    elderlyName?: string;
    type: AlertType | string;
    severity: AlertSeverity;
    message: string;
    timestamp: string;
    resolved: boolean;
    metadata?: Record<string, unknown>;
}

export interface AlertsSummary {
    total: number;
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    byType: Record<string, number>;
}

export interface AdminAlertsResponse {
    alerts: Alert[];
    summary: AlertsSummary;
}

export interface AlertFilters {
    severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    type?: string;
    userId?: string;
    resolved?: boolean;
}

// Legacy grouped type (still used by AlertsPanel for grouping)
export interface ElderlyAlertGroup {
    elderlyUserId: string;
    elderlyName: string;
    alerts: Alert[];
}

export interface ResolveAlertRequest {
    resolvedBy: string;
}

// ---------------------------------------------------------------------------
// User types (GET /admin/users, GET /admin/users/{userId})
// ---------------------------------------------------------------------------

export type UserRole = 'ELDERLY' | 'FAMILY' | 'AGENT' | 'ADMIN';

export interface AdminUser {
    userId: string;
    email: string;
    name: string;
    role: UserRole;
    phone?: string;
    city?: string;
    active: boolean;
    profileComplete?: boolean;
    onboardingStep?: string;
    createdAt: string;
}

export interface AdminUsersResponse {
    users: AdminUser[];
    count: number;
}

export interface AdminUserDetail extends AdminUser {
    address?: string;
    age?: number;
    preExistingConditions?: string[];
    medications?: { name: string; dosage: string }[];
    memorySummary?: string;
}

export interface CreateAgentRequest {
    email: string;
    name: string;
    phone: string;
    city: string;
}

export interface CreateAgentResponse {
    userId: string;
    email: string;
    name: string;
    role: 'AGENT';
    defaultPassword: string;
    message: string;
}

export interface ToggleUserStatusRequest {
    active: boolean;
}

export interface ToggleUserStatusResponse {
    userId: string;
    active: boolean;
    message: string;
}

// ---------------------------------------------------------------------------
// Escalation types (GET /admin/escalations/*)
// ---------------------------------------------------------------------------

export type EscalationPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type EscalationResolution = 'APPROVED' | 'REJECTED' | 'MANUAL_COMPLETED' | 'RESOLVED';

export interface Escalation {
    escalationId: string;
    taskId: string;
    userId: string;
    userName: string;
    userCity: string;
    category: string;
    title: string;
    description: string;
    escalationReason: string;
    priority: EscalationPriority;
    suggestedAction: string;
    toolsUsed: string[];
    cost: number;
    executionTime: number;
    createdAt: string;
    context?: Record<string, unknown>;
}

export interface EscalationsResponse {
    escalations: Escalation[];
    count: number;
    summary: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
}

export interface EscalationStatsResponse {
    period: string;
    totalEscalations: number;
    totalTasks: number;
    escalationRate: number;
    byReason: Record<string, number>;
    byCategory: Record<string, number>;
    trend: string;
}

export interface ResolveEscalationRequest {
    resolution: EscalationResolution;
    notes: string;
}

// ---------------------------------------------------------------------------
// Daily / Weekly Summary (GET /admin/summary/*)
// ---------------------------------------------------------------------------

export type DailyStatus = 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'CRITICAL';

export interface DailySummaryResponse {
    date: string;
    generatedAt: string;
    status: DailyStatus;
    statusEmoji: string;
    summaryText: string;
    metrics: {
        totalTasks: number;
        aiCompleted: number;
        humanCompleted: number;
        totalCompleted: number;
        aiEscalated: number;
        aiSuccessRate: number;
        totalCost: number;
        avgExecutionTime: number;
    };
    byCategory: Record<string, {
        total: number;
        completed: number;
        escalated: number;
    }>;
    alerts: {
        total: number;
        critical: number;
        unresolved: number;
    };
    trends: {
        type: string;
        category: string;
        message: string;
    }[];
    recommendations: Recommendation[];
    needsAttention: {
        escalations: number;
        criticalAlerts: number;
        lowSuccessCategories: string[];
    };
}

export interface WeeklySummaryResponse {
    period: string;
    startDate: string;
    endDate: string;
    dailySummaries: {
        date: string;
        tasks: number;
    }[];
    weeklyTotals: {
        totalTasks: number;
        avgSuccessRate: number;
    };
}

// ---------------------------------------------------------------------------
// Recommendations & Anomalies
// ---------------------------------------------------------------------------

export type RecommendationPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type RecommendationType = 'PERFORMANCE' | 'ESCALATIONS' | 'CAPACITY' | 'ALERTS';

export interface Recommendation {
    priority: RecommendationPriority;
    type: RecommendationType;
    title: string;
    description: string;
    action: string;
}

export interface RecommendationsResponse {
    recommendations: Recommendation[];
    generatedAt: string;
}

export interface Anomaly {
    alertId: string;
    userId: string;
    timestamp: string;
    type: string;
    severity: string;
    message: string;
    resolved: boolean;
    metadata: {
        anomalyType: string;
        metric: string;
        threshold: string;
        actual: string;
        recommendation: string;
    };
}

export interface AnomaliesResponse {
    anomalies: Anomaly[];
    count: number;
    period: string;
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

export const SEVERITY_COLORS: Record<string, string> = {
    CRITICAL: 'red',
    HIGH: 'orange',
    MEDIUM: 'amber',
    WARNING: 'amber',
    INFO: 'blue',
};
