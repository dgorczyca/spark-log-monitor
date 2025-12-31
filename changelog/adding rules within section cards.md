# Walkthrough - Dynamic Log Line Spans

I have implemented the ability to define dynamic span rules for log lines. This allows you to split log lines into separate spans with specific names and values.

## Changes

### Database
- Added `span_rules` table to store parsing rules.

### Backend
- Updated `db.ts` to handle `span_rules`.
- Added **POST** endpoint `/api/sections/:id/span-rules` to create new rules.
- Added **DELETE** endpoint `/api/span-rules/:id` to delete rules.

### Frontend
- Created `AddSpanRuleDialog` component.
- Updated `SectionCard` to:
  - Display "Add Span Rule" button.
  - Fetch and apply span rules to log lines.
  - Parse log lines and display extracted spans.
  - Display a delete button (X) on span badges to remove the rule.

## Verification Results

### Database Schema
Verified that the `span_rules` table exists with correct columns.

### API
Verified that:
- Can create a new section.
- Can add a span rule to a section.
- Can delete a span rule.
- `getSections` returns sections with their span rules.

### UI
The UI now allows adding span rules and displays parsed logs.

- If no rules exist, the raw log line is shown.
- If rules exist, the log line is parsed and displayed as "Name: Value" badges.
- Hovering over a badge reveals an "X" button. Clicking it deletes the rule.

## How to Test

1. Open the dashboard.
2. Find a section card (or create one).
3. Click the "+" icon in the card header.
4. Enter **Rule Name** (e.g., "Minimum Age").
5. Enter **"Starts with"** string (e.g., "minimum age was set to ").
6. Enter **"Followed by"** string (optional, e.g., ", whilst").
7. Click "Add Rule".
8. Observe the log lines in the card. They should now be parsed according to the rule.
9. Hover over a span badge and click the "X" to remove the rule. The log line should revert to its previous state (or raw text if no rules remain).