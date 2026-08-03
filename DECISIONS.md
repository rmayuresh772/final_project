# FinTrack — Design Decisions

## Overview
This document explains every major design choice made while building FinTrack, a multi-tenant expense management SaaS application.

---

## 1. Architecture

### Next.js 14 App Router
- **Decision**: Use Next.js 14 App Router with server components and API routes.
- **Rationale**: App Router provides co-located API routes, server-side rendering for dashboards, and built-in support for streaming responses (used for CSV export). It also enables fetching data directly in server components without an additional client-state layer.

### Monorepo Structure
- **Decision**: Single Next.js project with `/app`, `/components`, `/lib`, `/services`, `/repositories`, `/validators` directories.
- **Rationale**: A single project is sufficient for this scope. The separation into `repositories` (data access), `services` (business logic), and `validators` (input validation) follows clean architecture principles without over-engineering.

---

## 2. Database Schema (Prisma + PostgreSQL)

### Multi-Tenancy via `organizationId`
- **Decision**: Every table that needs isolation has an `organizationId` foreign key. All queries filter by `organizationId` from the JWT.
- **Rationale**: This is the simplest and most reliable multi-tenant isolation strategy. Row-level security (RLS) was considered but adds complexity without clear benefit for this scale. The `organizationId` is embedded in the JWT and extracted by `requireAuth()` on every request.

### Soft Deletes with `deletedAt`
- **Decision**: Use a nullable `deletedAt` timestamp instead of a boolean `isDeleted`.
- **Rationale**: A timestamp provides more information (when it was deleted) and enables potential recovery. The spec explicitly required `deleted_at nullable timestamp`. Every query filters `deletedAt: null`.

### Composite Unique Constraint `(org_id, receipt_reference)`
- **Decision**: `receiptReference` is a user-provided string (e.g., invoice number, receipt ID) that must be unique within an organization.
- **Rationale**: This prevents duplicate submissions of the same receipt within a company. The `receiptReference` is required on creation and serves as a business-level deduplication key.

### AuditLog Table
- **Decision**: Separate `AuditLog` table recording every status change with `fromStatus`, `toStatus`, `userId`, and `metadata`.
- **Rationale**: The spec requires audit entries for every status transition. A dedicated table is cleaner than JSON blobs or event sourcing for this use case. The `fromStatus`/`toStatus` fields make it easy to query the history of a specific expense.

### Indexes
- **`expenses.org_id`**: All queries filter by organization. Without this index, every query would be a full table scan.
- **`expenses.status`**: The approval workflow queries by status (`SUBMITTED`). Managers see all submitted expenses — this index makes that fast.
- **`expenses.submitted_at`**: Dashboard aggregations group by month. This index enables efficient range scans for monthly reporting.
- **`expenses.user_id`**: Employee dashboards show "my expenses". This index makes per-user queries efficient.

### Categories
- **Decision**: Use `TRAVEL`, `FOOD`, `EQUIPMENT`, `OTHER` as per spec.
- **Rationale**: The spec explicitly lists "travel, food, equipment, other". The original schema had extra categories (ACCOMMODATION, OFFICE, SOFTWARE, TRAINING) which were removed to match requirements.

---

## 3. Authentication

### JWT with httpOnly Cookies
- **Decision**: JWT tokens stored in httpOnly cookies, not localStorage.
- **Rationale**: httpOnly cookies are not accessible via JavaScript, preventing XSS-based token theft. The JWT payload includes `userId`, `organizationId`, and `role` — all required for authorization decisions.

### Multi-Tenant Registration
- **Decision**: Registration creates both an Organization and an Admin user simultaneously.
- **Rationale**: This is the simplest onboarding flow. The registrant becomes the Admin of their organization and can invite others.

### Invitation System
- **Decision**: Time-limited tokens (48 hours) stored in the database. Admin creates an invitation, and the invitee accepts via a token-based endpoint.
- **Rationale**: Token-based invitations are simple and don't require email infrastructure. The 48-hour expiry is per spec. The token is a cryptographically random hex string.

### Role-Based Access Control
- **Decision**: Three roles — `ADMIN`, `MANAGER`, `EMPLOYEE` — enforced via `requireRole()` middleware.
- **Rationale**: The spec defines these three roles. ADMIN can manage budgets and invite users. MANAGER can approve/reject expenses. EMPLOYEE can submit expenses.

---

## 4. Expense State Machine

### Status Flow
```
DRAFT → SUBMITTED → APPROVED
                   → REJECTED
```
- **Decision**: Guard clauses prevent invalid transitions. Only DRAFT expenses can be edited/deleted. Only SUBMITTED expenses can be approved/rejected. Approved expenses cannot be reversed.
- **Rationale**: This matches the spec exactly. The state machine is enforced in the service layer, not just the UI.

### Budget Check on Approval
- **Decision**: Approving an expense triggers a budget check. If the organization's monthly budget would be exceeded, the API returns a 422 with a warning. A manager can override with `overrideBudget: true` in the request body.
- **Rationale**: The spec requires this exact behavior. The budget check uses Prisma's `aggregate` to sum approved expenses for the current month — computed in SQL, not JavaScript.

---

## 5. Dashboard Aggregations

### SQL-Level Aggregations
- **Decision**: All aggregations (counts, sums, groupBy) use Prisma's `count()`, `aggregate()`, and `groupBy()` which translate to SQL.
- **Rationale**: The spec explicitly requires "All aggregations must happen in SQL/Prisma — not computed in JavaScript after fetching all rows." The monthly trend, category breakdown, top spenders, and budget status all use `groupBy` with `_sum` — computed in SQL.

### Role-Specific Views
- **Decision**: The dashboard page checks the user's role and renders different components.
- **Employee**: Own expenses grouped by status (SQL count), total spend this month vs last month (SQL aggregate).
- **Manager**: Team spend by category this month (Recharts bar chart, SQL groupBy), top 5 spenders (SQL groupBy + orderBy + take), pending approval count.
- **Admin**: Total monthly spend vs budget with >80% visual indicator, organisation-wide category breakdown (SQL groupBy), monthly trend for last 6 months (SQL groupBy).

---

## 6. CSV Export

### Server-Side Streaming
- **Decision**: The CSV is generated on the server using a `ReadableStream`. Data is fetched in batches of 100 using cursor-based pagination, and each row is streamed to the client.
- **Rationale**: The spec requires "The CSV must be generated on the server — not client-side" and "Generating the CSV must not load all rows into memory at once." The cursor-based approach ensures memory usage is O(batch_size), not O(total_rows).

### Content-Type and Content-Disposition
- **Decision**: Response headers set `Content-Type: text/csv` and `Content-Disposition: attachment`.
- **Rationale**: This forces the browser to download the file rather than display it inline.

---

## 7. State Management

### Zustand
- **Decision**: Zustand is used for client-side auth state via `stores/auth-store.ts` with `persist` middleware.
- **Rationale**: The auth store holds the current user (id, name, email, role, organizationId) and is set on login and cleared on logout. Server components fetch data directly, eliminating the need for client-side state management for initial data.

### Zod Validation
- **Decision**: All API inputs are validated with Zod schemas.
- **Rationale**: Zod provides type-safe validation with excellent error messages. Schemas are defined once and used for both client and server validation.

---

## 8. TypeScript

### Strict Mode
- **Decision**: `tsconfig.json` has `strict: true`. Zero `any`. Zero `ts-ignore`. `tsc --noEmit` passes with zero errors.
- **Rationale**: The spec requires "TypeScript strict mode. Zero 'any'. Zero ts-ignore." All error handling uses `unknown` with proper type narrowing. All component props use explicit interfaces.

---

## 9. Seed Script

### Demo Data
- **Decision**: The seed script creates two organizations, five users (across roles), a budget, eight expenses with various statuses, and audit log entries.
- **Rationale**: This provides immediately testable data. The demo accounts use `password123` for simplicity. Expenses span current and previous months to test dashboard aggregations.

---

## 10. Deployment

### Vercel + Railway
- **Decision**: Frontend on Vercel, PostgreSQL on Railway.
- **Rationale**: Vercel is the recommended deployment platform for Next.js. Railway provides a managed PostgreSQL database with a free tier suitable for demo purposes. All API fetches use relative URLs (`/api/...`) so they work in any environment.
