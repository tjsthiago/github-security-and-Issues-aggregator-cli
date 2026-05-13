## ADDED Requirements

### Requirement: Write aggregated Dependabot Alerts Report to a Markdown file
The system SHALL process the list of active Dependabot Alerts and write a single Markdown file (`dependabot-report.md`) to the current working directory. The report MUST include all fetched active alerts.

#### Scenario: Alerts are exported to Markdown successfully
- **WHEN** the aggregate-alerts-to-markdown command is executed and active alerts exist
- **THEN** a file named `dependabot-report.md` is created (or overwritten) in the output directory containing all active alerts

#### Scenario: No active alerts to aggregate
- **WHEN** the target repository has no active Dependabot alerts
- **THEN** the system writes a `dependabot-report.md` file with a message indicating there are no active alerts, without error

### Requirement: Format each Dependabot Alert entry with a Sequential Index in its title
The system SHALL prefix each Dependabot Alert entry in the Markdown Report with an auto-incremental Sequential Index (1-based) in its heading. The format MUST be `# <index>. <Dependency Name> - <Severity>` (e.g., `# 1. lodash - HIGH`).

#### Scenario: Multiple alerts receive unique sequential indices
- **WHEN** the report contains multiple alerts
- **THEN** each alert heading starts with a unique sequential number beginning at 1 and incrementing by 1 per entry, in the same order they were fetched

#### Scenario: Single alert receives index 1
- **WHEN** the report contains exactly one alert
- **THEN** its heading is prefixed with `# 1. <dependency> - <severity>`

### Requirement: Separate Dependabot Alert entries with a Delimiter
The system SHALL insert a Delimiter (`---`) between consecutive Dependabot Alert entries in the Markdown Report to visually separate each alert block.

#### Scenario: Delimiter appears between two alerts
- **WHEN** the report contains two or more alerts
- **THEN** a `---` line appears between each pair of consecutive alert entries

#### Scenario: No trailing delimiter after the last alert
- **WHEN** the report contains one or more alerts
- **THEN** no `---` delimiter appears after the last alert entry

### Requirement: Include full Vulnerability context in each report entry
Each Dependabot Alert entry in the Markdown Report SHALL include: alert number, dependency name, vulnerable version range, patched/fixed version, CVE identifier, GHSA advisory URL, severity, and the advisory summary.

#### Scenario: Alert with complete vulnerability data is rendered in the report
- **WHEN** an alert has all vulnerability fields populated
- **THEN** all fields (CVE, severity, affected version, fix version, GHSA URL, summary) appear in the alert entry

#### Scenario: Alert is missing optional fields
- **WHEN** an alert has no CVE ID (e.g., only a GHSA identifier)
- **THEN** the CVE field is omitted or marked as not available, and the entry is still written without error
