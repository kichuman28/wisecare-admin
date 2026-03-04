import { api } from '@/lib/api/axios-instance';
import type {
    ServiceRequestStatus,
    ServiceRequestsResponse,
    AvailableAgentsResponse,
    AssignAgentRequest,
    AssignAgentResponse,
    ResolveAlertRequest,
} from './admin.types';

// ---------------------------------------------------------------------------
// Admin API calls
// ---------------------------------------------------------------------------

export const adminApi = {
    /**
     * Fetch service requests, optionally filtered by status.
     * Admin role sees ALL requests across all elderly users.
     */
    getServiceRequests(status?: ServiceRequestStatus) {
        const params = status ? { status } : undefined;
        return api.get<ServiceRequestsResponse>('/service-requests', { params });
    },

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

    /** Mark an alert as resolved */
    resolveAlert(alertId: string, data: ResolveAlertRequest) {
        return api.patch<{ success: boolean }>(
            `/alerts/${alertId}/resolve`,
            data,
        );
    },
} as const;
