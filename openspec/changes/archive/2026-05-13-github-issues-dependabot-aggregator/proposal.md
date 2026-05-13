## Why

Security reviews and issue audits for private GitHub repositories require manually navigating the GitHub UI, copying content, and formatting it for review. This CLI tool automates that process by consolidating open Issues and Dependabot Alerts from a target repository into structured Markdown reports, enabling faster auditing, SLA tracking, and offline review.

## What Changes

- New TypeScript CLI tool (`src/`) with Domain-Driven Design architecture.
- Command to list all open Issues from a target GitHub repository in the terminal.
- Command to list all active Dependabot Alerts from a target GitHub repository in the terminal.
- Command to export all open Issues to a single `.md` file, each entry separated by `---` and prefixed with an auto-incremental sequential index (e.g., `# 1. [Issue Title]`).
- Command to export all active Dependabot Alerts to a single `.md` file using the same formatting convention (delimiter + sequential index).
- Authentication via PAT (Personal Access Token) stored in a `.env` file — never hardcoded.
- GitHub API integration using native Node.js `fetch` (no external HTTP client libraries).

## Capabilities

### New Capabilities

- `fetch-issues`: Authenticates against the GitHub API using a PAT and retrieves all open Issues from the configured target repository.
- `fetch-dependabot-alerts`: Authenticates against the GitHub API using a PAT and retrieves all active Dependabot Alerts from the configured target repository, capturing vulnerability context and severity.
- `aggregate-issues-to-markdown`: Processes the list of fetched Issues and writes a structured Markdown Report to disk. Each Issue entry is prefixed with a Sequential Index in its title and separated by the Delimiter (`---`).
- `aggregate-alerts-to-markdown`: Processes the list of fetched Dependabot Alerts and writes a structured Markdown Report to disk, applying the same Sequential Index and Delimiter formatting rules used for Issues.

### Modified Capabilities

## Impact

- New project structure under `/src` following DDD layers: `domain`, `application`, `infrastructure`, `shared`.
- New test structure under `/tests` (unit and integration).
- New root config files: `tsconfig.json`, `package.json`, `.env.example`, `vitest.config.ts`.
- No existing code is modified — this is a greenfield implementation.
- Runtime dependency on Node.js LTS native `fetch`; no external HTTP client libraries added.
- GitHub API rate limits and PAT scope requirements (`repo`, `security_events`) must be considered.
