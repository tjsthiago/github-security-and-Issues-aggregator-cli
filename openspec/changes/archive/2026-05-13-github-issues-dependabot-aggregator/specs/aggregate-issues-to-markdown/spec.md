## ADDED Requirements

### Requirement: Write aggregated Issues Report to a Markdown file
The system SHALL process the list of open Issues and write a single Markdown file (`issues-report.md`) to the current working directory. The report MUST include all fetched issues.

#### Scenario: Issues are exported to Markdown successfully
- **WHEN** the aggregate-issues-to-markdown command is executed and issues exist
- **THEN** a file named `issues-report.md` is created (or overwritten) in the output directory containing all open issues

#### Scenario: No open issues to aggregate
- **WHEN** the target repository has no open issues
- **THEN** the system writes an `issues-report.md` file with a message indicating there are no open issues, without error

### Requirement: Format each Issue entry with a Sequential Index in its title
The system SHALL prefix each Issue entry in the Markdown Report with an auto-incremental Sequential Index (1-based) in its heading. The format MUST be `# <index>. <Issue Title>` (e.g., `# 1. Fix null pointer in checkout`).

#### Scenario: Multiple issues receive unique sequential indices
- **WHEN** the report contains multiple issues
- **THEN** each issue heading starts with a unique sequential number beginning at 1 and incrementing by 1 per entry, in the same order they were fetched

#### Scenario: Single issue receives index 1
- **WHEN** the report contains exactly one issue
- **THEN** its heading is prefixed with `# 1. <title>`

### Requirement: Separate Issue entries with a Delimiter
The system SHALL insert a Delimiter (`---`) between consecutive Issue entries in the Markdown Report to visually separate each issue block.

#### Scenario: Delimiter appears between two issues
- **WHEN** the report contains two or more issues
- **THEN** a `---` line appears between each pair of consecutive issue entries

#### Scenario: No trailing delimiter after the last issue
- **WHEN** the report contains one or more issues
- **THEN** no `---` delimiter appears after the last issue entry

### Requirement: Include full Issue content in each report entry
Each Issue entry in the Markdown Report SHALL include at minimum: the issue number, URL, labels, assignees, and the full issue body.

#### Scenario: Issue body is rendered in the report
- **WHEN** an issue has a non-empty body
- **THEN** the full body text is included verbatim under the issue heading in the report

#### Scenario: Issue body is empty
- **WHEN** an issue has no body
- **THEN** the entry still appears in the report with its heading and metadata, and the body section is either omitted or marked as empty
