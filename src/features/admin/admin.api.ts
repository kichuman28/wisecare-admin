import { api } from '@/lib/api/axios-instance';
import type {
    ServiceRequestStatus,
    ServiceRequestsResponse,
    AvailableAgentsResponse,
    AssignAgentRequest,
    AssignAgentResponse,
    ResolveAlertRequest,
    AdminStatsResponse,
    AdminAlertsResponse,
    AlertFilters,
    AdminUsersResponse,
    AdminUserDetail,
    CreateAgentRequest,
    CreateAgentResponse,
    ToggleUserStatusRequest,
    ToggleUserStatusResponse,
    EscalationsResponse,
    EscalationStatsResponse,
    ResolveEscalationRequest,
    DailySummaryResponse,
    WeeklySummaryResponse,
    RecommendationsResponse,
    AnomaliesResponse,
    UserRole,
    RulesResponse,
    RulesFilters,
    Rule,
    RuleCreateRequest,
    RuleCreateResponse,
    RuleUpdateRequest,
    RuleUpdateResponse,
    RuleDeleteResponse,
    RuleToggleRequest,
    RuleToggleResponse,
    RuleTestRequest,
    RuleTestResponse,
    AIAgentConfigResponse,
    AIAgentConfigUpdateRequest,
    CategoryToggleRequest,
    CategoryToggleResponse,
    CategoryLimitsUpdateRequest,
    CategoryLimitsUpdateResponse,
} from './admin.types';

// ---------------------------------------------------------------------------
// Admin API calls
// ---------------------------------------------------------------------------

export const adminApi = {
    // ── Stats ──────────────────────────────────────────────────────────────

    /** Platform-wide dashboard stats */
    getStats() {
        return api.get<AdminStatsResponse>('/admin/stats');
    },

    // ── Service Requests ───────────────────────────────────────────────────

    /**
     * Fetch service requests, optionally filtered by status.
     * Admin role sees ALL requests across all elderly users.
     */
    getServiceRequests(status?: ServiceRequestStatus) {
        const params = status ? { status } : undefined;
        return api.get<ServiceRequestsResponse>('/service-requests', { params });
    },

    // ── Agents ─────────────────────────────────────────────────────────────

    /** Fetch all agents currently available for assignment */
    getAvailableAgents() {
        return api.get<AvailableAgentsResponse>('/admin/agents/available');
    },

    /** Assign a service request to an agent */
    assignAgent(requestId: string, data: AssignAgentRequest) {
        return api.patch<AssignAgentResponse>(
            `/service-requests/${requestId}/assign`,
            data,
        );
    },

    // ── Alerts ─────────────────────────────────────────────────────────────

    /** Fetch all alerts with optional filters */
    getAlerts(filters?: AlertFilters) {
        return api.get<AdminAlertsResponse>('/admin/alerts', { params: filters });
    },

    /** Mark an alert as resolved */
    resolveAlert(alertId: string, data: ResolveAlertRequest) {
        return api.patch<{ success: boolean }>(
            `/alerts/${alertId}/resolve`,
            data,
        );
    },

    // ── Users ──────────────────────────────────────────────────────────────

    /** Fetch all users, optionally filtered by role and active status */
    getUsers(role?: UserRole, active?: boolean) {
        const params: Record<string, string> = {};
        if (role) params.role = role;
        if (active !== undefined) params.active = String(active);
        return api.get<AdminUsersResponse>('/admin/users', { params });
    },

    /** Fetch full profile of a specific user */
    getUserDetail(userId: string) {
        return api.get<AdminUserDetail>(`/admin/users/${userId}`);
    },

    /** Create a new agent account */
    createAgent(data: CreateAgentRequest) {
        return api.post<CreateAgentResponse>('/admin/users/agent', data);
    },

    /** Activate or deactivate a user */
    toggleUserStatus(userId: string, data: ToggleUserStatusRequest) {
        return api.patch<ToggleUserStatusResponse>(
            `/admin/users/${userId}/status`,
            data,
        );
    },

    // ── Escalations ────────────────────────────────────────────────────────

    /** Get pending escalations that need admin attention */
    getEscalations(limit?: number, priority?: string) {
        const params: Record<string, string | number> = {};
        if (limit) params.limit = limit;
        if (priority) params.priority = priority;
        return api.get<EscalationsResponse>('/admin/escalations/pending', { params });
    },

    /** Get escalation statistics over time */
    getEscalationStats(period?: string) {
        const params = period ? { period } : undefined;
        return api.get<EscalationStatsResponse>('/admin/escalations/stats', { params });
    },

    /** Resolve an escalation */
    resolveEscalation(escalationId: string, data: ResolveEscalationRequest) {
        return api.post<{ escalationId: string; resolution: string; message: string }>(
            `/admin/escalations/${escalationId}/resolve`,
            data,
        );
    },

    // ── Summaries & AI ─────────────────────────────────────────────────────

    /** Get AI-generated daily summary */
    getDailySummary(date?: string) {
        const params = date ? { date } : undefined;
        return api.get<DailySummaryResponse>('/admin/summary/daily', { params });
    },

    /** Get weekly summary (last 7 days) */
    getWeeklySummary() {
        return api.get<WeeklySummaryResponse>('/admin/summary/weekly');
    },

    /** Get AI-generated recommendations */
    getRecommendations() {
        return api.get<RecommendationsResponse>('/admin/recommendations');
    },

    /** Get recent anomalies */
    getAnomalies(hours?: number) {
        const params = hours ? { hours } : undefined;
        return api.get<AnomaliesResponse>('/admin/anomalies', { params });
    },

    // ── Rules Engine ───────────────────────────────────────────────────────

    /** List all rules with optional filtering */
    getRules(filters?: RulesFilters) {
        return api.get<RulesResponse>('/admin/rules', { params: filters });
    },

    /** Get a specific rule by ID */
    getRule(ruleId: string) {
        return api.get<Rule>(`/admin/rules/${ruleId}`);
    },

    /** Create a new rule */
    createRule(data: RuleCreateRequest) {
        return api.post<RuleCreateResponse>('/admin/rules', data);
    },

    /** Update an existing rule */
    updateRule(ruleId: string, data: RuleUpdateRequest) {
        return api.patch<RuleUpdateResponse>(`/admin/rules/${ruleId}`, data);
    },

    /** Delete a rule */
    deleteRule(ruleId: string) {
        return api.delete<RuleDeleteResponse>(`/admin/rules/${ruleId}`);
    },

    /** Toggle a rule enabled/disabled */
    toggleRule(ruleId: string, data: RuleToggleRequest) {
        return api.post<RuleToggleResponse>(`/admin/rules/${ruleId}/toggle`, data);
    },

    /** Test a rule against sample data */
    testRule(data: RuleTestRequest) {
        return api.post<RuleTestResponse>('/admin/rules/test', data);
    },

    // ── AI Agent Configuration ─────────────────────────────────────────────

    /** Get current AI agent configuration */
    getAIAgentConfig() {
        return api.get<AIAgentConfigResponse>('/admin/ai-agent/config');
    },

    /** Update AI agent configuration */
    updateAIAgentConfig(data: AIAgentConfigUpdateRequest) {
        return api.patch<{ message: string; config: Partial<AIAgentConfigResponse['config']>; version: string }>(
            '/admin/ai-agent/config',
            data,
        );
    },

    /** Enable or disable a category */
    toggleCategory(category: string, data: CategoryToggleRequest) {
        return api.post<CategoryToggleResponse>(
            `/admin/ai-agent/categories/${category}/toggle`,
            data,
        );
    },

    /** Update limits for a specific category */
    updateCategoryLimits(category: string, data: CategoryLimitsUpdateRequest) {
        return api.patch<CategoryLimitsUpdateResponse>(
            `/admin/ai-agent/categories/${category}/limits`,
            data,
        );
    },
} as const;


