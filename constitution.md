# Project Constitution

## 1. Project Goals
- **Maintainability**: Code should be clean, well-documented, and easy to understand.
- **Scalability**: Architecture should support future growth without major refactoring.
- **Reliability**: High test coverage and robust error handling are mandatory.

## 2. Technology Stack
- **Framework**: Vite with React (if applicable) or Vanilla TypeScript.
- **Language**: TypeScript (Strict mode enabled).
- **Styling**: Vanilla CSS or TailwindCSS (if requested).
- **Testing**: Vitest for unit tests, Playwright for E2E (if applicable).

## 3. Coding Standards
- **Functional Style**: Prefer pure functions and immutability where possible.
- **Naming Conventions**:
  - Variables/Functions: `camelCase`
  - Components/Classes: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`
- **Comments**: Explain "why", not "what". Use JSDoc for public APIs.

## 4. Spec-Driven Development (SDD)
- **Source of Truth**: The `specs/` directory contains the source of truth for all features.
- **Workflow**:
  1. Create a spec in `specs/<feature-name>/spec.md`.
  2. Create a plan in `specs/<feature-name>/plan.md`.
  3. Create tasks in `specs/<feature-name>/tasks.md`.
  4. Implement and verify.

## 5. AI Agent Guidelines
- **Context**: Always read the relevant specs and constitution before starting a task.
- **Atomic Changes**: Keep changes small and focused on a single task.
- **Verification**: Always verify changes with tests or manual steps before marking a task as done.
