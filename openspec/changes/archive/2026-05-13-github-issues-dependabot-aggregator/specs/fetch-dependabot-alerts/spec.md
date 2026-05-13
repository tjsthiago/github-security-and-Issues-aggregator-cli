## ADDED Requirements

### Requirement: Authenticate with GitHub API for Dependabot Alerts using PAT
The system SHALL authenticate all Dependabot Alerts API requests using a PAT loaded from `GITHUB_TOKEN`. The PAT MUST have `security_events` scope to access Dependabot alerts in private repositories.

#### Scenario: PAT has required scopes
- **WHEN** `GITHUB_TOKEN` is set with `repo` and `security_events` scopes
- **THEN** the system authenticates successfully and retrieves active Dependabot alerts

#### Scenario: PAT lacks security_events scope
- **WHEN** the GitHub API returns HTTP 403 for the Dependabot alerts request
- **THEN** the system SHALL surface a clear error message indicating insufficient PAT permissions and document the required scopes

### Requirement: Retrieve all active Dependabot Alerts from target repository
The system SHALL retrieve all active (open) Dependabot Alerts from the configured target GitHub repository. Each alert MUST capture the vulnerable dependency name, vulnerable version range, patched version, CVE identifier, severity, and GHSA advisory URL. The system MUST handle pagination to return all active alerts.

#### Scenario: Repository has active Dependabot alerts
- **WHEN** the target repository has one or more active Dependabot alerts
- **THEN** the system returns a complete list of alerts including: alert number, dependency name, vulnerable version range, fixed version, severity (critical/high/medium/low), CVE ID, GHSA URL, and advisory summary

#### Scenario: Repository has no active Dependabot alerts
- **WHEN** the target repository has zero active Dependabot alerts
- **THEN** the system returns an empty list without error

#### Scenario: Repository has more than one page of Dependabot alerts
- **WHEN** the target repository has more active alerts than the API default page size
- **THEN** the system SHALL follow pagination links and return all alerts across all pages

#### Scenario: Dependabot alerts are disabled for the repository
- **WHEN** the GitHub API returns HTTP 403 indicating Dependabot alerts are not enabled
- **THEN** the system SHALL surface a clear error message indicating that Dependabot alerts are disabled for the repository

### Requirement: Display fetched Dependabot Alerts in the terminal
The system SHALL print the list of fetched active Dependabot Alerts to standard output in a readable terminal format.

#### Scenario: Alerts are listed in the terminal
- **WHEN** the fetch-dependabot-alerts command is executed successfully
- **THEN** each alert is printed to stdout with at minimum its number, dependency name, severity, and CVE ID
