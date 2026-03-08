import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminApi } from './admin.api';
import type {
    ServiceRequestStatus,
    AssignAgentRequest,
    ResolveAlertRequest,
    AlertFilters,
    UserRole,
    CreateAgentRequest,
    ToggleUserStatusRequest,
    ResolveEscalationRequest,
    RulesFilters,
    RuleCreateRequest,
    RuleUpdateRequest,
    RuleToggleRequest,
    RuleTestRequest,
    AIAgentConfigUpdateRequest,
    CategoryToggleRequest,
    CategoryLimitsUpdateRequest,
} from './admin.types';

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const adminKeys = {
    stats: ['admin-stats'] as const,
    serviceRequests: (status?: ServiceRequestStatus) =>
        ['service-requests', status] as const,
    availableAgents: ['available-agents'] as const,
    alerts: (filters?: AlertFilters) => ['admin-alerts', filters] as const,
    users: (role?: UserRole, active?: boolean) => ['admin-users', role, active] as const,
    userDetail: (userId: string) => ['admin-user-detail', userId] as const,
    escalations: (priority?: string) => ['admin-escalations', priority] as const,
    escalationStats: (period?: string) => ['admin-escalation-stats', period] as const,
    dailySummary: (date?: string) => ['admin-daily-summary', date] as const,
    weeklySummary: ['admin-weekly-summary'] as const,
    recommendations: ['admin-recommendations'] as const,
    anomalies: (hours?: number) => ['admin-anomalies', hours] as const,
    rules: (filters?: RulesFilters) => ['admin-rules', filters] as const,
    rule: (ruleId: string) => ['admin-rule', ruleId] as const,
    aiAgentConfig: ['admin-ai-agent-config'] as const,
};

// ---------------------------------------------------------------------------
// Queries — Stats
// ---------------------------------------------------------------------------

/** Platform-wide dashboard stats */
export function useAdminStats() {
    return useQuery({
        queryKey: adminKeys.stats,
        queryFn: () => adminApi.getStats().then((r) => r.data),
    });
}

// ---------------------------------------------------------------------------
// Queries — Service Requests
// ---------------------------------------------------------------------------

/** Fetch pending service requests (shorthand) */
export function usePendingRequests() {
    return useQuery({
        queryKey: adminKeys.serviceRequests('PENDING'),
        queryFn: () =>
            adminApi.getServiceRequests('PENDING').then((r) => r.data),
    });
}

/** Fetch service requests by status (parameterized) */
export function useRequests(status?: ServiceRequestStatus) {
    return useQuery({
        queryKey: adminKeys.serviceRequests(status),
        queryFn: () =>
            adminApi.getServiceRequests(status).then((r) => r.data),
    });
}

/** Fetch in-progress requests (for dashboard stat) */
export function useInProgressRequests() {
    return useQuery({
        queryKey: adminKeys.serviceRequests('IN_PROGRESS'),
        queryFn: () =>
            adminApi.getServiceRequests('IN_PROGRESS').then((r) => r.data),
    });
}

// ---------------------------------------------------------------------------
// Queries — Agents
// ---------------------------------------------------------------------------

/** Fetch all available agents */
export function useAvailableAgents() {
    return useQuery({
        queryKey: adminKeys.availableAgents,
        queryFn: () => adminApi.getAvailableAgents().then((r) => r.data),
    });
}

// ---------------------------------------------------------------------------
// Queries — Alerts
// ---------------------------------------------------------------------------

/** Fetch alerts with optional filters */
export function useAlerts(filters?: AlertFilters) {
    return useQuery({
        queryKey: adminKeys.alerts(filters),
        queryFn: () => adminApi.getAlerts(filters).then((r) => r.data),
    });
}

// ---------------------------------------------------------------------------
// Queries — Users
// ---------------------------------------------------------------------------

/** Fetch users, optionally filtered by role and active status */
export function useUsers(role?: UserRole, active?: boolean) {
    return useQuery({
        queryKey: adminKeys.users(role, active),
        queryFn: () => adminApi.getUsers(role, active).then((r) => r.data),
    });
}

/** Fetch a single user's full profile */
export function useUserDetail(userId: string) {
    return useQuery({
        queryKey: adminKeys.userDetail(userId),
        queryFn: () => adminApi.getUserDetail(userId).then((r) => r.data),
        enabled: !!userId,
    });
}

// ---------------------------------------------------------------------------
// Queries — Escalations
// ---------------------------------------------------------------------------

/** Fetch pending escalations */
export function useEscalations(priority?: string) {
    return useQuery({
        queryKey: adminKeys.escalations(priority),
        queryFn: () => adminApi.getEscalations(undefined, priority).then((r) => r.data),
    });
}

/** Fetch escalation statistics */
export function useEscalationStats(period?: string) {
    return useQuery({
        queryKey: adminKeys.escalationStats(period),
        queryFn: () => adminApi.getEscalationStats(period).then((r) => r.data),
    });
}

// ---------------------------------------------------------------------------
// Queries — Summaries & AI
// ---------------------------------------------------------------------------

/** Fetch AI-generated daily summary */
export function useDailySummary(date?: string) {
    return useQuery({
        queryKey: adminKeys.dailySummary(date),
        queryFn: () => adminApi.getDailySummary(date).then((r) => r.data),
    });
}

/** Fetch weekly summary */
export function useWeeklySummary() {
    return useQuery({
        queryKey: adminKeys.weeklySummary,
        queryFn: () => adminApi.getWeeklySummary().then((r) => r.data),
    });
}

/** Fetch AI recommendations */
export function useRecommendations() {
    return useQuery({
        queryKey: adminKeys.recommendations,
        queryFn: () => adminApi.getRecommendations().then((r) => r.data),
    });
}

/** Fetch system anomalies */
export function useAnomalies(hours?: number) {
    return useQuery({
        queryKey: adminKeys.anomalies(hours),
        queryFn: () => adminApi.getAnomalies(hours).then((r) => r.data),
    });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/** Assign an agent to a service request */
export function useAssignAgent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            requestId,
            data,
        }: {
            requestId: string;
            data: AssignAgentRequest;
        }) => adminApi.assignAgent(requestId, data).then((r) => r.data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-requests'] });
            queryClient.invalidateQueries({ queryKey: adminKeys.availableAgents });
            queryClient.invalidateQueries({ queryKey: adminKeys.stats });
            toast.success('Agent assigned successfully');
        },
        onError: () => toast.error('Failed to assign agent'),
    });
}

/** Resolve an alert */
export function useResolveAlert() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            alertId,
            data,
        }: {
            alertId: string;
            data: ResolveAlertRequest;
        }) => adminApi.resolveAlert(alertId, data).then((r) => r.data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-alerts'] });
            queryClient.invalidateQueries({ queryKey: adminKeys.stats });
            toast.success('Alert resolved');
        },
        onError: () => toast.error('Failed to resolve alert'),
    });
}

/** Create a new agent */
export function useCreateAgent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAgentRequest) =>
            adminApi.createAgent(data).then((r) => r.data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            queryClient.invalidateQueries({ queryKey: adminKeys.stats });
            toast.success('Agent created successfully');
        },
        onError: () => toast.error('Failed to create agent'),
    });
}

/** Toggle user active status */
export function useToggleUserStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            userId,
            data,
        }: {
            userId: string;
            data: ToggleUserStatusRequest;
        }) => adminApi.toggleUserStatus(userId, data).then((r) => r.data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success('User status updated');
        },
        onError: () => toast.error('Failed to update user status'),
    });
}

/** Resolve an escalation */
export function useResolveEscalation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            escalationId,
            data,
        }: {
            escalationId: string;
            data: ResolveEscalationRequest;
        }) => adminApi.resolveEscalation(escalationId, data).then((r) => r.data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-escalations'] });
            queryClient.invalidateQueries({ queryKey: ['admin-escalation-stats'] });
            toast.success('Escalation resolved');
        },
        onError: () => toast.error('Failed to resolve escalation'),
    });
}

// ---------------------------------------------------------------------------
// Queries — Rules Engine
// ---------------------------------------------------------------------------

/** Fetch rules with optional filters */
export function useRules(filters?: RulesFilters) {
    return useQuery({
        queryKey: adminKeys.rules(filters),
        queryFn: () => adminApi.getRules(filters).then((r) => r.data),
    });
}

/** Fetch a single rule */
export function useRule(ruleId: string) {
    return useQuery({
        queryKey: adminKeys.rule(ruleId),
        queryFn: () => adminApi.getRule(ruleId).then((r) => r.data),
        enabled: !!ruleId,
    });
}

/** Fetch AI Agent Configuration */
export function useAIAgentConfig() {
    return useQuery({
        queryKey: adminKeys.aiAgentConfig,
        queryFn: () => adminApi.getAIAgentConfig().then((r) => r.data),
    });
}

// ---------------------------------------------------------------------------
// Mutations — Rules Engine
// ---------------------------------------------------------------------------

export function useCreateRule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RuleCreateRequest) => adminApi.createRule(data).then((r) => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-rules'] });
            toast.success('Rule created successfully');
        },
        onError: () => toast.error('Failed to create rule'),
    });
}

export function useUpdateRule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ruleId, data }: { ruleId: string; data: RuleUpdateRequest }) =>
            adminApi.updateRule(ruleId, data).then((r) => r.data),
        onSuccess: (_, { ruleId }) => {
            queryClient.invalidateQueries({ queryKey: ['admin-rules'] });
            queryClient.invalidateQueries({ queryKey: adminKeys.rule(ruleId) });
            toast.success('Rule updated successfully');
        },
        onError: () => toast.error('Failed to update rule'),
    });
}

export function useDeleteRule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ruleId: string) => adminApi.deleteRule(ruleId).then((r) => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-rules'] });
            toast.success('Rule deleted successfully');
        },
        onError: () => toast.error('Failed to delete rule'),
    });
}

export function useToggleRule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ruleId, data }: { ruleId: string; data: RuleToggleRequest }) =>
            adminApi.toggleRule(ruleId, data).then((r) => r.data),
        onSuccess: (_, { ruleId }) => {
            queryClient.invalidateQueries({ queryKey: ['admin-rules'] });
            queryClient.invalidateQueries({ queryKey: adminKeys.rule(ruleId) });
            toast.success('Rule status changed');
        },
        onError: () => toast.error('Failed to toggle rule'),
    });
}

export function useTestRule() {
    return useMutation({
        mutationFn: (data: RuleTestRequest) => adminApi.testRule(data).then((r) => r.data),
        onSuccess: () => toast.success('Rule tested against payload'),
        onError: () => toast.error('Failed to test rule'),
    });
}

// ---------------------------------------------------------------------------
// Mutations — AI Agent Config
// ---------------------------------------------------------------------------

export function useUpdateAIAgentConfig() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: AIAgentConfigUpdateRequest) =>
            adminApi.updateAIAgentConfig(data).then((r) => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.aiAgentConfig });
            toast.success('AI config updated');
        },
        onError: () => toast.error('Failed to update AI config'),
    });
}

export function useToggleCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ category, data }: { category: string; data: CategoryToggleRequest }) =>
            adminApi.toggleCategory(category, data).then((r) => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.aiAgentConfig });
            toast.success('Category settings updated');
        },
        onError: () => toast.error('Failed to update category'),
    });
}

export function useUpdateCategoryLimits() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ category, data }: { category: string; data: CategoryLimitsUpdateRequest }) =>
            adminApi.updateCategoryLimits(category, data).then((r) => r.data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.aiAgentConfig }),
    });
}
