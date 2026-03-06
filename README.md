# WiseCare Console

> A role-based web console for managing the WiseCare elderly care ecosystem — admin operations, family dashboards, and service request lifecycle.

---

## The Idea

WiseCare is an **AI-powered elderly care platform**.  
- **Elderly users** interact with **Arya**, an AI companion that detects needs (groceries, medication, appointments) and raises service requests automatically.  
- **Agents** (field workers) fulfil those requests — managed via a separate mobile app.  
- **Family members** monitor their elderly loved ones and manage relationships.  
- **Admins** oversee the entire system — reviewing requests, assigning agents, and monitoring alerts.

This repo is the **web console** — the central dashboard used by **admins** and **family members**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 7 |
| Routing | React Router v7 |
| State / Server | TanStack React Query v5 |
| HTTP Client | Axios (JWT interceptors) |
| Styling | Tailwind CSS v4 (custom `@theme` tokens) |
| Font | Inter (Google Fonts — 400, 500, 600, 700) |
| Icons | Custom SVG icon library (`shared/components/Icons.tsx`) |
| Auth | JWT (access + refresh tokens), `localStorage` |

---

## Architecture

### Feature-Based Folder Structure

```
src/
├── app/                          # Application shell
│   ├── App.tsx                   # Root component
│   ├── providers.tsx             # QueryClient + AuthProvider
│   ├── router.tsx                # All route definitions
│   ├── layouts/
│   │   ├── AdminLayout.tsx       # Sidebar shell for /admin/*
│   │   └── FamilyLayout.tsx      # Shell for /family/*
│   └── routes/
│       ├── RoleRedirect.tsx      # "/" → role-specific dashboard
│       ├── admin.pages.tsx       # Re-exports from features/admin
│       └── family.pages.tsx      # Re-exports from features/family
│
├── features/                     # Feature modules (strict boundaries)
│   ├── auth/                     # Authentication (shared across roles)
│   │   ├── auth.types.ts         # AuthUser, AuthResponse, etc.
│   │   ├── auth.api.ts           # signin, signup, signout, refresh
│   │   ├── auth.context.tsx      # AuthProvider + session restore
│   │   ├── use-auth.ts           # useAuth() hook
│   │   ├── index.ts              # Barrel export
│   │   └── components/
│   │       ├── LoginPage.tsx     # Shared login form
│   │       ├── AuthGuard.tsx     # Requires authentication
│   │       └── RoleGuard.tsx     # Requires specific role
│   │
│   ├── admin/                    # Admin dashboard module
│   │   ├── admin.types.ts        # ServiceRequest, Agent, Alert types
│   │   ├── admin.api.ts          # GET /service-requests, agents, alerts
│   │   ├── admin.hooks.ts        # React Query hooks (queries + mutations)
│   │   ├── index.ts              # Barrel export
│   │   ├── components/
│   │   │   ├── AdminStats.tsx    # Dashboard stat cards
│   │   │   ├── RequestsTable.tsx # Service requests data table
│   │   │   ├── AssignAgentModal.tsx  # Agent selection + assignment
│   │   │   └── AlertsPanel.tsx   # Grouped alerts with resolve
│   │   └── pages/
│   │       ├── AdminDashboard.tsx     # Overview with stats
│   │       ├── RequestsPage.tsx      # Tabbed request management
│   │       └── AlertsPage.tsx        # Alert monitoring
│   │
│   └── family/                   # Family member module
│       ├── family.types.ts       # FamilyProfile, ElderlyLink types
│       ├── family.api.ts         # Profile, onboarding, link APIs
│       ├── index.ts              # Barrel export
│       └── components/
│           ├── FamilySignupPage.tsx          # Family registration
│           ├── FamilyBasicOnboardingPage.tsx # Step 1: basic info
│           ├── FamilyLinkPage.tsx            # Step 2: link elderly
│           └── FamilyGuards.tsx             # Onboarding/dashboard guards
│
├── shared/                       # Cross-cutting concerns
│   ├── types/index.ts            # UserRole, TokenPayload, etc.
│   ├── constants/index.ts        # ROUTES, getDashboardRoute()
│   ├── components/
│   │   ├── Icons.tsx             # 17 themed SVG icons (brand-consistent)
│   │   ├── StatusBadge.tsx       # Color-coded status badge
│   │   ├── PriorityBadge.tsx     # Priority indicator with icon
│   │   ├── LoadingState.tsx      # Spinner with message
│   │   ├── EmptyState.tsx        # No-data placeholder
│   │   ├── DataTable.tsx         # Generic typed table
│   │   ├── AgentCard.tsx         # Agent info card (for assignment)
│   │   └── index.ts              # Barrel export
│   └── hooks/                    # (reserved for shared hooks)
│
└── lib/                          # Infrastructure / third-party wrappers
    ├── api/
    │   └── axios-instance.ts     # Axios with JWT interceptors + silent refresh
    ├── auth/
    │   └── token-storage.ts      # localStorage token management
    └── react-query/
        └── query-client.ts       # QueryClient (5min stale, 10min gc)
```

### Design Principles

1. **Feature isolation** — each feature module owns its types, API, hooks, components, and pages. No cross-feature imports except through barrel exports.
2. **Data layer separation** — API calls live in `*.api.ts`, never inside components. React Query hooks wrap API calls and manage caching/invalidation.
3. **Role-based routing** — `AuthGuard` requires login, `RoleGuard` restricts by role, `RoleRedirect` sends `/` to the correct dashboard.
4. **Token lifecycle** — Axios interceptors handle JWT attachment and silent refresh on 401. Token expiry is checked pre-request.

---

## Routes

### Public
| Route | Page |
|-------|------|
| `/login` | Login (all roles) |
| `/signup/family` | Family member registration |

### Admin (`ADMIN` role required)
| Route | Page |
|-------|------|
| `/admin` | Dashboard — stats, quick actions, recent pending |
| `/admin/service-requests` | Tabbed request management (6 status filters) |
| `/admin/users` | User management (placeholder — needs backend) |
| `/admin/alerts` | Alert monitoring with resolve |

### Family (`FAMILY` role required)
| Route | Page |
|-------|------|
| `/family/onboarding/basic` | Onboarding step 1 — basic info |
| `/family/onboarding/link` | Onboarding step 2 — link elderly |
| `/family` | Family dashboard |

---

## Backend APIs Used

All requests go through the Axios instance which attaches `Authorization: Bearer <accessToken>` automatically.

| Method | Endpoint | Used By |
|--------|----------|---------|
| `POST` | `/auth/signin` | Auth module |
| `POST` | `/auth/signup` | Auth module |
| `POST` | `/auth/signout` | Auth module |
| `POST` | `/auth/refresh` | Axios interceptor |
| `GET` | `/users/me` | Family onboarding |
| `GET` | `/service-requests?status=X` | Admin dashboard |
| `GET` | `/admin/agents/available` | Admin assign modal |
| `PATCH` | `/service-requests/{id}/assign` | Admin assign agent |
| `PATCH` | `/alerts/{id}/resolve` | Admin alerts |
| `POST` | `/family/onboarding/basic-info` | Family onboarding |
| `POST` | `/family/link-elderly` | Family linking |

---

## UI / Design System

### Brand Colors

Defined as Tailwind CSS v4 `@theme` tokens in `src/index.css`, mapped from the Flutter mobile app's `Co.*` palette:

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#FF6933` | CTAs, active nav indicators, links |
| `primary-hover` | `#E55A28` | Button hover states |
| `navy` / `navy-dark` | `#1F234D` / `#171A3A` | Sidebar, headers, gradients |
| `gradient-top` / `gradient-bottom` | `#282D5A` / `#1A1E45` | Navy gradient backgrounds |
| `warm-bg` | `#FAF8F6` | Page backgrounds |
| `card-surface` | `#FFFFFF` | Cards, modals, table cells |
| `on-background` | `#1C1B1F` | Primary text |
| `text-muted` | `#79747E` | Secondary / helper text |
| `outline` | `#E0DCE4` | Borders, dividers |
| `error` | `#B3261E` | Error text |
| `icon-shield` | `#4A5075` | Logo badges, avatar backgrounds |

### Layout Patterns

- **Auth pages** (Login, Signup, Onboarding): 60/40 split — navy gradient branding panel on the left, warm-bg form on the right. Mobile-responsive (branding panel hides on small screens).
- **Admin layout**: Collapsible sidebar — expands to 256px with icons + labels, collapses to 72px icon rail. Main content reflows with the sidebar width. Chevron toggle at bottom.
- **Family layout**: Navy header bar with logo and user info.

### Icon Library

`src/shared/components/Icons.tsx` — 17 custom SVG icons (stroke-based, `currentColor`) replacing all emoji usage. Icons: `DashboardIcon`, `RequestsIcon`, `AlertIcon`, `UsersIcon`, `ClipboardIcon`, `RefreshIcon`, `ShieldIcon`, `HeartIcon`, `CheckCircleIcon`, `XCircleIcon`, `ActivityIcon`, `AlertTriangleIcon`, `InfoIcon`, `AlertCriticalIcon`, `MailCheckIcon`, `LogOutIcon`, `StarIcon`.

---

## Implemented Features

### ✅ Authentication
- Shared login page (60/40 split layout) for all roles
- JWT token storage with expiry checking
- Silent token refresh via Axios interceptor
- Session restore on page reload
- Role-based redirect after login
- Sign-out with token invalidation

### ✅ Admin Dashboard
- **Overview**: 3 stat cards with branded gradients (orange, navy, teal) and SVG watermark icons
- **Service Requests**: 6-tab filtered table (Pending → Assigned → Accepted → In Progress → Completed → Rejected)
- **Assign Agent**: Modal to fetch available agents, filter by city, select and assign
- **Alerts**: Grouped alerts by elderly user with SVG severity icons and resolve buttons
- **Layout**: Collapsible sidebar (full ↔ icon rail) with orange active nav indicators

### ✅ Family Module
- **Signup**: 60/40 split registration page with feature pills
- **Onboarding**: 2-step flow with visual step indicators (basic info → link elderly user)
- **Guards**: Route guards for onboarding-in-progress vs. dashboard-ready states
- **Dashboard**: Post-onboarding landing page

### 🚧 Pending
- **Admin Users Page**: Placeholder — needs `GET /admin/users` backend endpoint
- **Family Dashboard**: Placeholder — needs additional family-specific endpoints

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Install dependencies
cd wisecare-admin
npm install

# Configure environment
cp .env.example .env
# Set VITE_API_BASE_URL to your backend URL
```

### Environment Variables

| Variable | Description |
|----------|------------|
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `https://api.wisecare.example.com`) |

### Development

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # TypeScript check + production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## Status Color Map

| Status | Color | Badge |
|--------|-------|-------|
| PENDING | Amber | 🟡 |
| ASSIGNED | Blue | 🔵 |
| ACCEPTED | Purple | 🟣 |
| IN_PROGRESS | Orange | 🟠 |
| COMPLETED | Green | 🟢 |
| REJECTED | Red | 🔴 |

---

## Notes for Future Development

- **Agent dashboard** is implemented in the **mobile app** (not this web console)
- The `UserRole` type still includes `'AGENT'` since the backend returns it — the web app simply doesn't have agent-specific routes
- React Query is configured with **5-minute stale time** and **10-minute garbage collection** — adjust in `lib/react-query/query-client.ts` if needed
- The Axios instance handles **token refresh queuing** — concurrent 401s share a single refresh call
- All path aliases use `@/` which maps to `src/` (configured in `vite.config.ts` and `tsconfig.json`)
