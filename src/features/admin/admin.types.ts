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

export interface ActivityTrendPoint {
    name: string;
    requests: number;
    alerts: number;
}

export interface AdminStatsResponse {
    generatedAt: string;
    activityTrend?: ActivityTrendPoint[];
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

// ---------------------------------------------------------------------------
// Rules Engine types (GET/POST/PATCH/DELETE /admin/rules)
// ---------------------------------------------------------------------------

export type RuleCategory = 'GROCERY' | 'MEDICINE' | 'FOOD' | 'DOCTOR' | 'ALL';

export type RuleType = 'APPROVAL' | 'BUDGET' | 'ESCALATION';

export type RuleOperator =
    | 'EQUALS'
    | 'NOT_EQUALS'
    | 'LESS_THAN'
    | 'GREATER_THAN'
    | 'LESS_THAN_OR_EQUAL'
    | 'GREATER_THAN_OR_EQUAL'
    | 'CONTAINS'
    | 'NOT_CONTAINS'
    | 'BETWEEN'
    | 'IN'
    | 'NOT_IN';

export type RuleActionType =
    | 'AUTO_APPROVE'
    | 'REQUIRE_APPROVAL'
    | 'ESCALATE'
    | 'REJECT';

export type RuleField =
    | 'orderTotal'
    | 'category'
    | 'prescriptionRequired'
    | 'userTier'
    | 'currentTime'
    | 'userDailySpent'
    | 'city';

export interface RuleCondition {
    field: RuleField | string;
    operator: RuleOperator;
    value: number | string | boolean | number[] | string[];
}

export interface RuleMetadata {
    createdBy: string;
    createdAt: string;
    updatedAt?: string;
}

export interface Rule {
    ruleId: string;
    name: string;
    description: string;
    category: RuleCategory;
    ruleType: RuleType;
    priority: number;
    enabled: string | boolean;
    conditions: RuleCondition;
    action: RuleActionType;
    metadata: RuleMetadata;
}

export interface RulesResponse {
    rules: Rule[];
    count: number;
}

export interface RulesFilters {
    category?: RuleCategory;
    enabled?: boolean;
    ruleType?: RuleType;
}

export interface RuleCreateRequest {
    name: string;
    description: string;
    category: RuleCategory;
    ruleType: RuleType;
    priority: number;
    conditions: RuleCondition;
    action: RuleActionType;
}

export interface RuleUpdateRequest {
    name?: string;
    description?: string;
    priority?: number;
    conditions?: RuleCondition;
    action?: RuleActionType;
}

export interface RuleCreateResponse {
    ruleId: string;
    message: string;
    rule: Pick<Rule, 'ruleId' | 'name' | 'category' | 'enabled'>;
}

export interface RuleUpdateResponse {
    ruleId: string;
    message: string;
    rule: Partial<Rule>;
}

export interface RuleDeleteResponse {
    ruleId: string;
    message: string;
}

export interface RuleToggleRequest {
    enabled: boolean;
}

export interface RuleToggleResponse {
    ruleId: string;
    enabled: boolean;
    message: string;
}

export interface RuleTestRequest {
    ruleId: string;
    testData: Record<string, unknown>;
}

export interface RuleTestResponse {
    matched: boolean;
    action: RuleActionType;
    conditions: RuleCondition;
    testData: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// AI Agent Configuration types (GET/PATCH /admin/ai-agent/config)
// ---------------------------------------------------------------------------

export interface CategoryConfig {
    enabled: boolean;
    autoApprovalLimit: number;
    requireApprovalAbove: number;
    escalationTriggers: string[];
}

export interface WorkingHoursConfig {
    aiAgent: string;
    humanAgents: {
        start: string;
        end: string;
    };
    afterHoursPolicy: string;
}

export interface BudgetLimitsConfig {
    perUser: {
        daily: number;
        monthly: number;
    };
    perCategory: Record<string, number>;
}

export interface AIAgentConfig {
    configId: string;
    categories: Record<string, CategoryConfig>;
    workingHours: WorkingHoursConfig;
    budgetLimits: BudgetLimitsConfig;
    version: string;
}

export interface AIAgentConfigResponse {
    config: AIAgentConfig;
    summary: {
        totalCategories: number;
        enabledCategories: number;
        disabledCategories: number;
        lastUpdated: string;
    };
}

export interface AIAgentConfigUpdateRequest {
    categories?: Record<string, Partial<CategoryConfig>>;
    budgetLimits?: {
        perUser?: Partial<BudgetLimitsConfig['perUser']>;
        perCategory?: Record<string, number>;
    };
}

export interface CategoryToggleRequest {
    enabled: boolean;
}

export interface CategoryToggleResponse {
    category: string;
    enabled: boolean;
    message: string;
}

export interface CategoryLimitsUpdateRequest {
    autoApprovalLimit?: number;
    requireApprovalAbove?: number;
    escalationTriggers?: string[];
}

export interface CategoryLimitsUpdateResponse {
    category: string;
    message: string;
    categoryConfig: CategoryConfig;
}
