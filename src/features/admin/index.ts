// Public API for the admin feature module

// Pages
export { AdminDashboard } from './pages/AdminDashboard';
export { RequestsPage } from './pages/RequestsPage';
export { AlertsPage } from './pages/AlertsPage';
export { UsersPage } from './pages/UsersPage';
export { EscalationsPage } from './pages/EscalationsPage';
export { AIOperationsPage } from './pages/AIOperationsPage';

// Components
export { AdminStats } from './components/AdminStats';
export { RequestsTable } from './components/RequestsTable';
export { AssignAgentModal } from './components/AssignAgentModal';
export { AlertsPanel } from './components/AlertsPanel';
export { CreateAgentModal } from './components/CreateAgentModal';
export { UserDetailDrawer } from './components/UserDetailDrawer';

// Hooks
export {
    useAdminStats,
    usePendingRequests,
    useRequests,
    useInProgressRequests,
    useAvailableAgents,
    useAlerts,
    useUsers,
    useUserDetail,
    useEscalations,
    useEscalationStats,
    useDailySummary,
    useWeeklySummary,
    useRecommendations,
    useAnomalies,
    useAssignAgent,
    useResolveAlert,
    useCreateAgent,
    useToggleUserStatus,
    useResolveEscalation,
    adminKeys,
} from './admin.hooks';

// API
export { adminApi } from './admin.api';

// Types
export type {
    ServiceRequest,
    ServiceRequestStatus,
    ServiceRequestPriority,
    AvailableAgent,
    Alert,
    AlertSeverity,
    AlertFilters,
    ElderlyAlertGroup,
    AdminStatsResponse,
    AdminUser,
    AdminUserDetail,
    AdminUsersResponse,
    Escalation,
    EscalationPriority,
    DailySummaryResponse,
    WeeklySummaryResponse,
    Recommendation,
    Anomaly,
    UserRole,
} from './admin.types';
