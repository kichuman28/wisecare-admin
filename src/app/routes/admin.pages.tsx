// ---------------------------------------------------------------------------
// Admin pages — wired to the admin feature module
// ---------------------------------------------------------------------------

export { AdminDashboard as AdminDashboardPage } from '@/features/admin';
export { RequestsPage as AdminServiceRequestsPage } from '@/features/admin';
export { AlertsPage as AdminAlertsPage } from '@/features/admin';
export { UsersPage as AdminUsersPage } from '@/features/admin';
export { EscalationsPage as AdminEscalationsPage } from '@/features/admin';
export { AIOperationsPage as AdminAIAgentConfigOpsPage } from '@/features/admin'; // keeping this as is in case of typos in original file, let me just append mine. Wait, the original is AIOperationsPage as AdminAIOperationsPage
export { AIOperationsPage as AdminAIOperationsPage } from '@/features/admin';
export { RulesPage as AdminRulesPage } from '@/features/admin';
export { AIAgentConfigPage as AdminAIAgentConfigPage } from '@/features/admin';
