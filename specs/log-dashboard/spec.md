# Log Dashboard Specification

## 1. Goal
Create a simple dashboard to monitor a log file on the local file system. Users can define "sections" that track specific rules (patterns) in the log stream. The dashboard displays the last three matches for each section and the time they first appeared.

## 2. User Stories
- As a user, I want to add a new section with a name and a rule (regex/string) so that I can track specific log entries.
- As a user, I want to view a dashboard of all my sections so that I can see the latest activity for each rule.
- As a user, I want to see the last three unique values that matched a section's rule, along with the timestamp of their first appearance.
- As a user, I want the dashboard to update in real-time (or near real-time) as new logs are written.

## 3. Acceptance Criteria
- [ ] **Add Section**: UI allows entering a Name and a Rule.
- [ ] **Persistence**: Sections and their matches are stored in a MySQL database.
- [ ] **Log Monitoring**: The application reads from a local log file and processes new lines against all active rules.
- [ ] **Display**:
    - Dashboard lists all sections.
    - Each section shows the last 3 unique matches.
    - Each match shows the value and the timestamp it was first seen.
- [ ] **Real-time**: New matches appear on the dashboard without requiring a full page refresh (polling or sockets).

## 4. Technical Constraints
- **Database**: MySQL.
- **Environment**: Local file system access required for log file.
- **Log Format**: Text-based log file.
