# Log Monitoring Dashboard

A real-time log monitoring dashboard that tracks specific patterns across multiple configurable sections, displaying the most recent matching values with timestamps.

**Experience Qualities**:
1. **Efficient** - Users can quickly add sections and see relevant log data without complexity
2. **Organized** - Clear visual separation between sections with distinct rules and results
3. **Responsive** - Real-time updates as logs are processed, showing immediate feedback

**Complexity Level**: Light Application (multiple features with basic state)
  - Multiple sections with individual configurations, persistent storage, and simulated real-time log processing

## Essential Features

### Section Management
- **Functionality**: Create, view, and delete monitoring sections with custom names and search rules
- **Purpose**: Allows users to track different log patterns simultaneously
- **Trigger**: Click the plus button in the header
- **Progression**: Click + button → Dialog opens → Enter section name → Enter search rule → Submit → Section card appears on dashboard
- **Success criteria**: Section persists after page refresh, appears in dashboard grid

### Rule-Based Log Filtering
- **Functionality**: Each section filters incoming logs based on its configured rule (pattern matching)
- **Purpose**: Extract relevant information from log stream for specific monitoring needs
- **Trigger**: Logs are processed automatically in the background
- **Progression**: Log entry arrives → Each section evaluates its rule → Matching sections update → Display shows new value with timestamp
- **Success criteria**: Only matching log entries appear in their respective sections

### Recent Values Tracking
- **Functionality**: Display the last three unique matching values per section with first-seen timestamps
- **Purpose**: Provides historical context while keeping the interface focused
- **Trigger**: New matching log entry is detected
- **Progression**: Match found → Check if value is new → Add to list with timestamp → Remove oldest if >3 values → Update display
- **Success criteria**: Each section shows max 3 values, oldest values drop off, timestamps are accurate

### Simulated Log Stream
- **Functionality**: Generate realistic log entries that sections can monitor
- **Purpose**: Demonstrate functionality without requiring filesystem access
- **Trigger**: Automatically runs when app is active
- **Progression**: Timer fires → Generate log entry → Broadcast to all sections → Sections evaluate rules → UI updates
- **Success criteria**: Logs generate continuously, sections update in real-time

## Edge Case Handling
- **Empty Dashboard**: Welcome message with guidance to create first section
- **No Matches Yet**: Section shows "Waiting for matches..." state
- **Invalid Rules**: Basic validation to prevent empty rules or names
- **Duplicate Values**: Only track unique values per section, ignore repeated matches
- **Delete Confirmation**: Prevent accidental section deletion

## Design Direction
The design should feel professional and focused, like a technical monitoring tool with clean data visualization - minimal interface that prioritizes information density and clarity over decoration, with purposeful use of color to indicate status and activity.

## Color Selection
Custom palette - A technical, monitoring-focused scheme with subtle accent colors for status indication and clear contrast for readability.

- **Primary Color**: Deep blue (#1e40af / oklch(0.45 0.12 260)) - Conveys trust and technical professionalism for primary actions
- **Secondary Colors**: 
  - Slate gray backgrounds for cards and sections
  - Light gray for subtle borders and dividers
- **Accent Color**: Vibrant cyan (#06b6d4 / oklch(0.7 0.12 200)) - Draws attention to active monitoring state and new data
- **Foreground/Background Pairings**:
  - Background (Light slate oklch(0.98 0.005 240)): Dark text oklch(0.2 0.01 240) - Ratio 12.5:1 ✓
  - Card (White oklch(1 0 0)): Dark text oklch(0.2 0.01 240) - Ratio 14:1 ✓
  - Primary (Deep blue oklch(0.45 0.12 260)): White text oklch(1 0 0) - Ratio 8.2:1 ✓
  - Accent (Cyan oklch(0.7 0.12 200)): Dark text oklch(0.2 0.01 240) - Ratio 7.8:1 ✓
  - Muted (Light gray oklch(0.95 0.005 240)): Medium gray text oklch(0.5 0.01 240) - Ratio 5.1:1 ✓

## Font Selection
A clean, monospace font for technical data (log values, timestamps) paired with a modern sans-serif for UI elements - conveying precision and readability appropriate for monitoring tools.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Semi-Bold/32px/tight tracking - Clean authority
  - H2 (Section Names): Inter Medium/18px/normal tracking - Clear hierarchy
  - Body (UI Text): Inter Regular/14px/relaxed line-height - Easy scanning
  - Monospace (Log Data): JetBrains Mono Regular/13px/1.5 line-height - Technical precision
  - Timestamps: Inter Regular/12px/tabular numbers - Consistent alignment
  - Labels: Inter Medium/12px/uppercase/wide tracking - Subtle emphasis

## Animations
Subtle, functional animations that provide feedback without distraction - emphasizing state changes and new data arrival with gentle transitions that reinforce the monitoring nature of the tool.

- **Purposeful Meaning**: New log matches fade in smoothly to catch attention, section additions slide in to show spatial relationship, deletions fade out gracefully
- **Hierarchy of Movement**: 
  - Critical: New data arrivals (200ms fade + slight scale)
  - Important: Section CRUD operations (300ms slide/fade)
  - Supporting: Hover states and button interactions (150ms)

## Component Selection
- **Components**:
  - **Card**: Primary container for each monitoring section with subtle shadow
  - **Dialog**: Modal for adding new sections with form inputs
  - **Button**: Primary for add action, ghost for delete actions
  - **Input**: Text fields for section name and rule pattern
  - **Label**: Form field labels in the dialog
  - **Badge**: Timestamp indicators with subtle background
  - **ScrollArea**: For sections list if it grows large
  
- **Customizations**:
  - Custom log entry component with monospace font
  - Status indicator for "waiting" vs "active" sections
  - Timestamp formatting with relative time display
  
- **States**:
  - Empty state with illustration and call-to-action
  - Loading/waiting state for sections without matches
  - Active state showing recent values
  - Hover states on section cards for delete action
  
- **Icon Selection**:
  - Plus (Add section)
  - Trash (Delete section)
  - Circle dot (Active indicator)
  - Clock (Timestamp indicator)
  - MagnifyingGlass (Search/rule icon)
  
- **Spacing**:
  - Page padding: p-6 (24px)
  - Card gaps: gap-6 (24px)
  - Internal card padding: p-4 (16px)
  - Section header gap: gap-3 (12px)
  - Log entry gap: gap-2 (8px)
  
- **Mobile**:
  - Single column grid on mobile
  - 2-column grid on tablet (md:)
  - 3-column grid on desktop (lg:)
  - Full-width dialog on mobile
  - Reduced padding on small screens (p-4)
