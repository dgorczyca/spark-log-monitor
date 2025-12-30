# Spark Log Monitor

A real-time log monitoring dashboard that tracks specific patterns in log files. It allows users to define rules (sections) to watch for, and displays the occurrences with timestamps and highlighting for the most recent events.

## Features

- **Real-time Monitoring**: Watches a log file (`app.log`) for changes in real-time.
- **Custom Rules**: Define sections with specific text patterns to monitor.
- **Occurrence Tracking**:
    - Tracks the **First Seen** timestamp.
    - Tracks the **Last Seen** timestamp.
    - Aggregates duplicate log entries.
- **Visual Highlighting**: Highlights the most recently updated log match in the dashboard.
- **Persistent Storage**: Stores sections and matches in a MySQL database.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, Chokidar (file watching)
- **Database**: MySQL
- **Containerization**: Docker (for MySQL)

## Prerequisites

- **Node.js** (v18 or higher)
- **Docker** & **Docker Compose** (for the database)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd spark-log-monitor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Database

Start the MySQL container using Docker Compose:

```bash
docker-compose up -d
```

### 4. Start the Application

You can start both the backend server and the frontend development server concurrently:

```bash
npm run dev
```

Or start them separately:

**Backend (Port 3001):**
```bash
npx ts-node server/index.ts
```

**Frontend (Port 5173):**
```bash
npm run vite
```

### 5. Simulate Logs

The application watches `app.log` in the root directory. You can manually append to this file to simulate logs:

```bash
echo "[INFO] error 1" >> app.log
```

## Usage

1.  Open the dashboard at `http://localhost:5173`.
2.  Click **"Add Section"** to create a new monitoring rule.
    *   **Name**: A display name for the section (e.g., "Errors").
    *   **Rule**: The text pattern to look for in the logs (e.g., "error").
3.  Append lines to `app.log` that contain the rule text.
4.  Watch the dashboard update in real-time!
    *   New matches will appear in the corresponding section.
    *   Repeated matches will update their "Last seen" timestamp.
    *   The most recently updated match will be highlighted.

## Architecture

The application consists of a file watcher that parses logs and updates a MySQL database. The React frontend polls the Express API to display the latest data.

For a detailed sequence diagram, see [architecture.md](./architecture.md).

## 🛠️ Spec-Driven Development

This project follows **Spec-Driven Development (SDD)** principles.
- **Constitution**: See [constitution.md](./constitution.md) for project principles and guidelines.
- **Specs**: All feature specifications and plans are located in the [specs/](./specs/) directory.
