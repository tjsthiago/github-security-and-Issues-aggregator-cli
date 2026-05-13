## Context

This is a greenfield TypeScript CLI project. There is no prior codebase — the tool is being built from scratch following Domain-Driven Design (DDD) principles. The tool targets a private GitHub repository (`nome-do-owner/nome-do-repositorio`) and integrates with the GitHub REST API using a PAT for authentication. The output artifacts are Markdown files stored locally.

The project runs on Node.js LTS and leverages native `fetch` for HTTP requests. All source code lives under `/src`, with test code under `/tests`. The architecture follows clean layering: domain → application → infrastructure → shared.

## Goals / Non-Goals

**Goals:**
- Implement a fully functional TypeScript CLI with strict-mode TypeScript and DDD layering.
- Provide four core capabilities: fetch issues, fetch Dependabot alerts, aggregate issues to Markdown, aggregate alerts to Markdown.
- Use native Node.js `fetch` exclusively — no external HTTP client libraries.
- Authenticate with GitHub API via a PAT loaded from `.env`.
- Format Markdown output with a sequential numeric index in each entry title and a `---` delimiter between entries.
- Cover all domain entities, value objects, use cases, and infrastructure adapters with unit and integration tests using Vitest.
- Provide `.env.example` documenting all required environment variables.

**Non-Goals:**
- Support for multiple GitHub providers (GitLab, Bitbucket, etc.).
- A web UI or REST API server.
- Persistent storage (database, cache) — each run fetches fresh data from GitHub.
- Scheduling or automation (cron jobs, CI pipelines). The tool runs on demand.
- Pagination beyond what is needed to retrieve all results (no cursor-based infinite scroll UI).
- Filtering, searching, or sorting of results beyond what the GitHub API provides by default.
- Support for GitHub Enterprise Server (only github.com).

## Decisions

### 1. Domain-Driven Design architecture

**Decision**: Use DDD tactical patterns (Entities, Value Objects, Repositories, Use Cases, Domain Services) with clean layer separation.

**Rationale**: The project mandate specifies DDD. It also future-proofs the codebase — new capabilities (e.g., PRs, code scanning alerts) can be added as new aggregates without touching existing layers.

**Alternatives considered**: Flat script-based architecture (rejected — too brittle, no testability guarantees).

---

### 2. Native `fetch` for HTTP

**Decision**: Use Node.js built-in `fetch` (available since Node 18 LTS) for all GitHub API calls. No `axios`, `got`, or `node-fetch`.

**Rationale**: Native `fetch` reduces dependency surface area, avoids supply-chain risk, and is sufficient for the simple GET request patterns needed.

**Alternatives considered**: `axios` (rejected — unnecessary dependency), `got` (rejected — same reason).

---

### 3. PAT-based authentication stored in `.env`

**Decision**: Store the GitHub PAT in `.env` under the key `GITHUB_TOKEN`. Load it via a dedicated config module at `/src/infrastructure/config`.

**Rationale**: Keeps secrets out of source code, follows the twelve-factor app methodology, and is simple to set up for solo use.

**Alternatives considered**: OAuth app flow (rejected — adds unnecessary complexity for a CLI tool used by a single authenticated developer).

---

### 4. Single output Markdown file per capability

**Decision**: Each aggregation command writes all entries to a single `.md` file (e.g., `issues-report.md`, `dependabot-report.md`) with entries separated by `---` and numbered sequentially.

**Rationale**: Matches the stated formatting requirements. A single file per type is easier to share and review than multiple files.

**Alternatives considered**: One file per issue/alert (rejected — harder to review and share); JSON output (rejected — Markdown is the required format).

---

### 5. Vitest for testing

**Decision**: Use Vitest for all unit and integration tests.

**Rationale**: Project mandate specifies Vitest. It has excellent TypeScript support and is fast.

---

### 6. CLI entry point

**Decision**: Implement the CLI using Node.js `process.argv` parsing directly, without a CLI framework.

**Rationale**: The command surface is small (4 commands). A framework like `commander` or `yargs` adds unnecessary dependencies and complexity.

**Alternatives considered**: `commander` (rejected — overkill for 4 commands), `yargs` (rejected — same).

## Risks / Trade-offs

- **GitHub API rate limits** → The PAT provides 5,000 requests/hour. For large repositories with many issues/alerts, pagination must be handled correctly. Mitigation: implement pagination loops with `Link` header parsing.
- **PAT scope requirements** → The PAT must have `repo` scope (for private repo issues) and `security_events` scope (for Dependabot alerts). Mitigation: document required scopes in `.env.example` and README.
- **Native `fetch` not available in Node < 18** → If the user runs an older Node version, `fetch` is undefined. Mitigation: document Node LTS requirement in README and `package.json` `engines` field.
- **Dependabot Alerts API requires special permissions** → Organization admins may restrict access to security alerts. Mitigation: provide a clear error message when the API returns 403 on the alerts endpoint.
- **No input validation on PAT** → If the PAT is missing or invalid, the GitHub API returns 401. Mitigation: validate the presence of `GITHUB_TOKEN` at startup and surface a clear error before making any API calls.
