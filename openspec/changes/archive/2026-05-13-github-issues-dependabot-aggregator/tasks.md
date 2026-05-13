## 1. Project Scaffolding

- [x] 1.1 Initialize `package.json` with name, version, scripts (`build`, `dev`, `test`, `test:unit`, `test:integration`), and `engines` field requiring Node.js LTS (>=18)
- [x] 1.2 Create `tsconfig.json` with `strict: true`, `module: NodeNext`, `target: ES2022`, and paths configured for `/src`
- [x] 1.3 Install dev dependencies: `typescript`, `vitest`, `@types/node`
- [x] 1.4 Create `.env.example` documenting `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO` with placeholder values and required PAT scopes (`repo`, `security_events`)
- [x] 1.5 Add `.env` to `.gitignore`
- [x] 1.6 Create the directory structure: `/src/domain`, `/src/application`, `/src/infrastructure`, `/src/shared`, `/tests/unit`, `/tests/integration`

## 2. Shared Layer

- [x] 2.1 Create `/src/shared/errors/AppError.ts` — base error class with `message` and optional `code`
- [x] 2.2 Create `/src/shared/errors/ValidationError.ts` — extends `AppError` for input validation failures
- [x] 2.3 Write unit tests for `AppError` and `ValidationError` under `/tests/unit/shared/errors/`

## 3. Infrastructure Config

- [x] 3.1 Create `/src/infrastructure/config/env.ts` — loads and validates `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO` from `process.env`; throws `ValidationError` if any are missing
- [x] 3.2 Write unit tests for `env.ts` covering missing token, missing owner, missing repo scenarios

## 4. Domain — Issue Entity & Value Objects

- [x] 4.1 Create `/src/domain/value-objects/IssueNumber.ts` — immutable VO wrapping a positive integer
- [x] 4.2 Create `/src/domain/value-objects/IssueTitle.ts` — immutable VO wrapping a non-empty string
- [x] 4.3 Create `/src/domain/value-objects/IssueUrl.ts` — immutable VO wrapping a valid URL string
- [x] 4.4 Create `/src/domain/entities/Issue.ts` — Entity with `id` (IssueNumber), `title` (IssueTitle), `url` (IssueUrl), `body`, `labels`, `assignees` fields; factory method `Issue.create()`
- [x] 4.5 Create `/src/domain/repositories/IIssueRepository.ts` — interface with `findAllOpen(): Promise<Issue[]>`
- [x] 4.6 Write unit tests for all Issue value objects and the `Issue` entity under `/tests/unit/domain/`

## 5. Domain — Dependabot Alert Entity & Value Objects

- [x] 5.1 Create `/src/domain/value-objects/AlertNumber.ts` — immutable VO wrapping a positive integer
- [x] 5.2 Create `/src/domain/value-objects/Severity.ts` — immutable VO wrapping enum `critical | high | medium | low`
- [x] 5.3 Create `/src/domain/value-objects/CveId.ts` — immutable VO wrapping an optional CVE string
- [x] 5.4 Create `/src/domain/entities/DependabotAlert.ts` — Entity with `number` (AlertNumber), `dependencyName`, `vulnerableVersionRange`, `patchedVersion`, `severity` (Severity), `cveId` (CveId), `ghsaUrl`, `summary`; factory method `DependabotAlert.create()`
- [x] 5.5 Create `/src/domain/repositories/IDependabotAlertRepository.ts` — interface with `findAllActive(): Promise<DependabotAlert[]>`
- [x] 5.6 Write unit tests for all Dependabot Alert value objects and `DependabotAlert` entity under `/tests/unit/domain/`

## 6. Infrastructure — GitHub API HTTP Client

- [x] 6.1 Create `/src/infrastructure/http/GitHubHttpClient.ts` — wraps native `fetch` with base URL `https://api.github.com`, sets `Authorization: Bearer <token>` and `Accept: application/vnd.github+json` headers; implements pagination via `Link` header parsing; throws `AppError` on non-2xx responses
- [x] 6.2 Write unit tests for `GitHubHttpClient` (mock `fetch` globally) covering auth header injection, pagination, 401/403/404 error handling

## 7. Infrastructure — Issue Repository Adapter

- [x] 7.1 Create `/src/infrastructure/repositories/GitHubIssueRepository.ts` — implements `IIssueRepository`; uses `GitHubHttpClient` to call `GET /repos/{owner}/{repo}/issues?state=open`; maps API response to `Issue` entities
- [x] 7.2 Write unit tests for `GitHubIssueRepository` (mock `GitHubHttpClient`) covering: successful fetch, empty result, pagination, 404/403 error
- [x] 7.3 Write integration test for `GitHubIssueRepository` calling the real GitHub API (requires `.env` with valid token)

## 8. Infrastructure — Dependabot Alert Repository Adapter

- [x] 8.1 Create `/src/infrastructure/repositories/GitHubDependabotAlertRepository.ts` — implements `IDependabotAlertRepository`; uses `GitHubHttpClient` to call `GET /repos/{owner}/{repo}/dependabot/alerts?state=open`; maps API response to `DependabotAlert` entities
- [x] 8.2 Write unit tests for `GitHubDependabotAlertRepository` (mock `GitHubHttpClient`) covering: successful fetch, empty result, pagination, 403 disabled scenario
- [x] 8.3 Write integration test for `GitHubDependabotAlertRepository` calling the real GitHub API (requires `.env` with valid token and `security_events` scope)

## 9. Application — Use Cases

- [x] 9.1 Create `/src/application/use-cases/FetchIssuesUseCase.ts` — accepts `IIssueRepository`, `execute()` returns `Issue[]`
- [x] 9.2 Create `/src/application/use-cases/FetchDependabotAlertsUseCase.ts` — accepts `IDependabotAlertRepository`, `execute()` returns `DependabotAlert[]`
- [x] 9.3 Create `/src/application/use-cases/AggregateIssuesToMarkdownUseCase.ts` — accepts `IIssueRepository`, `execute()` fetches issues and returns formatted Markdown string with sequential index headings and `---` delimiters
- [x] 9.4 Create `/src/application/use-cases/AggregateAlertsToMarkdownUseCase.ts` — accepts `IDependabotAlertRepository`, `execute()` fetches alerts and returns formatted Markdown string with sequential index headings and `---` delimiters
- [x] 9.5 Write unit tests for all four use cases under `/tests/unit/application/use-cases/` using in-memory fakes for repositories

## 10. Application — Markdown Formatting Rules

- [x] 10.1 Implement Issue Markdown entry format: `# <index>. <title>` heading, followed by issue number, URL, labels, assignees, and body
- [x] 10.2 Implement Dependabot Alert Markdown entry format: `# <index>. <dependency> - <SEVERITY>` heading, followed by alert number, CVE, GHSA URL, vulnerable range, patched version, and summary
- [x] 10.3 Implement `---` delimiter insertion between entries (not after the last entry)
- [x] 10.4 Write unit tests for Markdown formatting: single entry, multiple entries (verify delimiter placement), empty body, missing CVE

## 11. Infrastructure — File Writer

- [x] 11.1 Create `/src/infrastructure/FileReportWriter.ts` — writes a Markdown string to a given output path using `fs/promises`
- [x] 11.2 Write unit tests for `FileReportWriter` (mock `fs/promises`)

## 12. CLI Entry Point

- [x] 12.1 Create `/src/cli.ts` — parses `process.argv` for commands: `fetch-issues`, `fetch-dependabot-alerts`, `aggregate-issues`, `aggregate-alerts`
- [x] 12.2 Wire dependencies (config → http client → repositories → use cases) and dispatch to the correct use case based on the command
- [x] 12.3 For `aggregate-issues` and `aggregate-alerts` commands, write output to `issues-report.md` and `dependabot-report.md` respectively using `FileReportWriter`
- [x] 12.4 Print a usage message to stdout when no command or an unknown command is provided
- [x] 12.5 Add `"main": "dist/cli.js"` and `"bin"` entry to `package.json`

## 13. Build & Verification

- [x] 13.1 Run `npm run build` and verify the TypeScript compilation succeeds with zero errors
- [x] 13.2 Run `npm run test:unit` and verify all unit tests pass
- [x] 13.3 Run `npm run test:integration` (with valid `.env`) and verify all integration tests pass
- [x] 13.4 Smoke test: run `node dist/cli.js fetch-issues` and verify issues are printed to stdout
- [x] 13.5 Smoke test: run `node dist/cli.js aggregate-issues` and verify `issues-report.md` is created with correct sequential index and delimiter formatting
- [x] 13.6 Smoke test: run `node dist/cli.js aggregate-alerts` and verify `dependabot-report.md` is created with correct formatting
