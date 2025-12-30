# Implementation Plan - Log Dashboard

## 1. Architecture
- **Frontend**: React (Vite) + TailwindCSS (optional/standard).
    - Components: `Dashboard`, `SectionCard`, `AddSectionDialog`.
    - State Management: React Query or local state with polling.
- **Backend**: Node.js + Express.
    - API: `GET /api/sections`, `POST /api/sections`.
    - Log Watcher: A service that `tail`s the log file and matches lines against rules.
- **Database**: MySQL.
    - Tables: `Section` (id, name, rule), `Match` (id, section_id, value, first_seen_at).

## 2. Proposed Changes
### Backend
#### [NEW] [server/index.ts](file:///home/dev/code/spark-log-monitor/server/index.ts)
- Express server setup.
- Database connection.

#### [NEW] [server/db.ts](file:///home/dev/code/spark-log-monitor/server/db.ts)
- MySQL connection and schema initialization.

#### [NEW] [server/watcher.ts](file:///home/dev/code/spark-log-monitor/server/watcher.ts)
- Logic to read the log file and process rules.

### Frontend
#### [NEW] [src/components/SectionCard.tsx](file:///home/dev/code/spark-log-monitor/src/components/SectionCard.tsx)
- Display a single section and its matches.

#### [NEW] [src/components/AddSectionDialog.tsx](file:///home/dev/code/spark-log-monitor/src/components/AddSectionDialog.tsx)
- Form to add a new section.

#### [MODIFY] [src/App.tsx](file:///home/dev/code/spark-log-monitor/src/App.tsx)
- Main layout to hold the dashboard.

## 3. Verification Plan
### Automated Tests
- [ ] Backend: Unit tests for rule matching logic.
- [ ] Backend: API tests for creating sections.

### Manual Verification
1. Start the server and frontend.
2. Create a dummy log file (e.g., `test.log`).
3. Add a section "Errors" with rule "ERROR".
4. Append "ERROR: Something went wrong" to `test.log`.
5. Verify the dashboard updates with the new match.
