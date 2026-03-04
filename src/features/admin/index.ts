// Public API for the admin feature module

// Pages
export { AdminDashboard } from './pages/AdminDashboard';
export { RequestsPage } from './pages/RequestsPage';
export { AlertsPage } from './pages/AlertsPage';

// Components
export { AdminStats } from './components/AdminStats';
export { RequestsTable } from './components/RequestsTable';
export { AssignAgentModal } from './components/AssignAgentModal';
export { AlertsPanel } from './components/AlertsPanel';

// Hooks
export {
    usePendingRequests,
    useRequests,
    useInProgressRequests,
    useAvailableAgents,
    useAssignAgent,
    useResolveAlert,
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
    ElderlyAlertGroup,
} from './admin.types';
