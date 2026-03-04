import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from './admin.api';
import type {
    ServiceRequestStatus,
    AssignAgentRequest,
    ResolveAlertRequest,
} from './admin.types';

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const adminKeys = {
    serviceRequests: (status?: ServiceRequestStatus) =>
        ['service-requests', status] as const,
    availableAgents: ['available-agents'] as const,
    alerts: ['alerts'] as const,
};

// ---------------------------------------------------------------------------
// Queries
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

/** Fetch all available agents */
export function useAvailableAgents() {
    return useQuery({
        queryKey: adminKeys.availableAgents,
        queryFn: () => adminApi.getAvailableAgents().then((r) => r.data),
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
            // Invalidate all service-request queries so lists refresh
            queryClient.invalidateQueries({
                queryKey: ['service-requests'],
            });
            // Also refresh available agents (one less available)
            queryClient.invalidateQueries({
                queryKey: adminKeys.availableAgents,
            });
        },
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
            queryClient.invalidateQueries({
                queryKey: adminKeys.alerts,
            });
        },
    });
}
