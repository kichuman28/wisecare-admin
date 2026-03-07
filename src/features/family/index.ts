// Public API for the family feature module

// Onboarding components
export { FamilySignupPage } from './components/FamilySignupPage';
export { FamilyBasicOnboardingPage } from './components/FamilyBasicOnboardingPage';
export { FamilyLinkPage } from './components/FamilyLinkPage';
export { FamilyOnboardingGuard, FamilyDashboardGuard } from './components/FamilyGuards';

// Dashboard page
export { FamilyDashboard } from './pages/FamilyDashboard';

// API & hooks
export { familyApi } from './family.api';
export {
    useFamilyProfile,
    useElderlyVitals,
    useElderlyRisk,
    useElderlyAlerts,
    useElderlyServiceRequests,
    useResolveAlert,
} from './family.hooks';

// Types
export type {
    FamilyRelationship,
    FamilyBasicRequest,
    FamilyLinkRequest,
    FamilyProfile,
    VitalReading,
    VitalsResponse,
    RiskResponse,
    RiskLevel,
    ElderlyAlert,
    ElderlyAlertsResponse,
    ElderlyServiceRequest,
    ElderlyServiceRequestsResponse,
    ServiceRequestStatus,
} from './family.types';
