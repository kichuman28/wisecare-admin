import type { OnboardingStep } from '@/shared/types';

// ---------------------------------------------------------------------------
// Family-specific types
// ---------------------------------------------------------------------------

/** Relationship values accepted by POST /onboarding/family/basic */
export type FamilyRelationship =
    | 'Son'
    | 'Daughter'
    | 'Spouse'
    | 'Sibling'
    | 'Other';

// ---------------------------------------------------------------------------
// Request shapes
// ---------------------------------------------------------------------------

export interface FamilyBasicRequest {
    relationship: FamilyRelationship;
    city: string;
    phone: string;
}

export interface FamilyLinkRequest {
    inviteCode: string;
}

// ---------------------------------------------------------------------------
// Response shapes
// ---------------------------------------------------------------------------

export interface FamilyBasicResponse {
    message: string;
    onboardingStep: OnboardingStep;
}

export interface FamilyLinkResponse {
    message: string;
    elderlyUserId: string;
    elderlyName: string;
    elderlyCity: string;
}

/** Subset of /users/me relevant to family context */
export interface FamilyProfile {
    userId: string;
    email: string;
    name: string;
    role: 'FAMILY';
    phone: string;
    city: string;
    onboardingStep: OnboardingStep;
    profileComplete: boolean;
    linkedElderlyIds: string[];
}

// ---------------------------------------------------------------------------
// Vitals (GET /vitals/latest/{userId})
// ---------------------------------------------------------------------------

export interface VitalReading {
    userId: string;
    timestamp: string;
    heartRate: number;
    bpSystolic: number;
    bpDiastolic: number;
    accelSpike: number;
    source?: string;
}

export interface VitalsResponse {
    items: VitalReading[];
    count: number;
}

// ---------------------------------------------------------------------------
// Risk Score (GET /risk/{userId})
// ---------------------------------------------------------------------------

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RiskResponse {
    score: number;
    level: RiskLevel;
    factors: string[];
}

// ---------------------------------------------------------------------------
// Elderly Alerts (GET /alerts/user/{userId})
// ---------------------------------------------------------------------------

export type ElderlyAlertType =
    | 'FALL_DETECTED'
    | 'HIGH_BP'
    | 'LOW_OXYGEN'
    | 'COMPANION_CONCERN'
    | 'SOS'
    | 'MEDICATION_MISSED'
    | 'HEALTH_ANOMALY';

export type ElderlyAlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'WARNING' | 'INFO';

export interface ElderlyAlert {
    alertId: string;
    userId: string;
    timestamp: string;
    type: ElderlyAlertType | string;
    severity: ElderlyAlertSeverity;
    message: string;
    resolved: boolean;
    metadata?: Record<string, unknown>;
}

export interface ElderlyAlertsResponse {
    alerts: ElderlyAlert[];
    count: number;
}

// ---------------------------------------------------------------------------
// Elderly Service Requests (GET /service-requests?elderlyUserId={id})
// ---------------------------------------------------------------------------

export type ServiceRequestStatus =
    | 'PENDING'
    | 'ASSIGNED'
    | 'ACCEPTED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'REJECTED';

export interface ElderlyServiceRequest {
    requestId: string;
    elderlyUserId: string;
    elderlyName: string;
    requestType: string;
    category: string;
    title: string;
    description: string;
    status: ServiceRequestStatus;
    priority: string;
    assignedAgentId: string | null;
    assignedAgentName: string | null;
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
}

export interface ElderlyServiceRequestsResponse {
    requests: ElderlyServiceRequest[];
    count: number;
}

// ---------------------------------------------------------------------------
// Elderly Profile (GET /users/{elderlyUserId})
// ---------------------------------------------------------------------------

export interface ElderlyProfile {
    userId: string;
    name: string;
    age: number;
    city: string;
    address: string;
    phone: string;
    role: 'ELDERLY';
    status: string;
    riskLevel: RiskLevel;
    riskScore: number;
    medications: any[];
    emergencyContact: {
        name: string;
        phone: string;
        relation: string;
    };
    linkedFamilyIds: string[];
    profileComplete: boolean;
    createdAt: string;
}

// ---------------------------------------------------------------------------
// Medications
// ---------------------------------------------------------------------------

export interface Medication {
    medicationId: string;
    name: string;
    dosage: string;
    frequency: string;
    scheduledTime: string;
    taken: boolean;
    takenAt: string | null;
    notes: string;
}

export interface MedicationScheduleResponse {
    userId: string;
    date: string;
    medications: Medication[];
}

export interface MedicationRefill {
    refillId: string;
    medicationName: string;
    quantity: string;
    status: string;
    requestedAt: string;
    pharmacy: string;
    estimatedCost: number;
}

export interface MedicationRefillsResponse {
    refills: MedicationRefill[];
}

// ---------------------------------------------------------------------------
// Memory & Timeline
// ---------------------------------------------------------------------------

export interface TimelineEvent {
    eventId: string;
    type: 'VITALS' | 'MEDICATION' | 'APPOINTMENT' | 'ALERT' | 'SERVICE_REQUEST';
    category: string;
    title: string;
    description: string;
    severity?: string;
    timestamp: string;
    metadata?: any;
}

export interface TimelineResponse {
    userId: string;
    timeline: TimelineEvent[];
    count: number;
}

export interface MemoryEvent {
    eventId: string;
    userId: string;
    category: string;
    content: string;
    source: string;
    timestamp: string;
    metadata?: any;
}

export interface MemoryEventsResponse {
    events: MemoryEvent[];
}

// ---------------------------------------------------------------------------
// Wallet & Payments
// ---------------------------------------------------------------------------

export interface Wallet {
    userId: string;
    balance: number;
    currency: string;
    status: string;
    dailyLimit: number;
    monthlyLimit: number;
    dailySpent: number;
    monthlySpent: number;
    lowBalanceThreshold: number;
    lastResetDate: string;
    lastMonthReset: string;
}

export interface WalletTransaction {
    transactionId: string;
    type: 'CREDIT' | 'DEBIT';
    amount: number;
    category: string;
    description: string;
    status: string;
    balanceBefore: number;
    balanceAfter: number;
    timestamp: string;
    serviceRequestId?: string;
}

export interface WalletTransactionsResponse {
    transactions: WalletTransaction[];
    count: number;
}

export interface WalletTopupResponse {
    message: string;
    transactionId: string;
    newBalance: number;
}

// ---------------------------------------------------------------------------
// Emergency Features (SOS)
// ---------------------------------------------------------------------------

export interface SosEvent {
    sosId: string;
    userId: string;
    location: {
        latitude: number;
        longitude: number;
    };
    timestamp: string;
    status: string;
    resolvedAt?: string;
    resolvedBy?: string;
}

export interface SosHistoryResponse {
    sosEvents: SosEvent[];
}
