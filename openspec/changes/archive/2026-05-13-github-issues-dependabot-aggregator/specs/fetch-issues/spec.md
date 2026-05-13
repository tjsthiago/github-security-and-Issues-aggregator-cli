## ADDED Requirements

### Requirement: Authenticate with GitHub API using PAT
The system SHALL authenticate all GitHub API requests using a Personal Access Token (PAT) loaded from the `GITHUB_TOKEN` environment variable. The PAT MUST have `repo` scope to access issues in private repositories.

#### Scenario: PAT is present and valid
- **WHEN** `GITHUB_TOKEN` is set in the environment and the PAT has sufficient scope
- **THEN** the system authenticates successfully and retrieves open issues from the target repository

#### Scenario: PAT is missing
- **WHEN** `GITHUB_TOKEN` is not set in the environment
- **THEN** the system SHALL halt with a clear error message indicating the missing token before making any API call

#### Scenario: PAT is invalid or unauthorized
- **WHEN** the GitHub API returns HTTP 401 for the issues request
- **THEN** the system SHALL surface a clear error message indicating authentication failure

### Requirement: Retrieve all open Issues from target repository
The system SHALL retrieve all open Issues from the configured target GitHub repository using the GitHub REST API. The system MUST handle pagination to ensure all open issues are returned, not just the first page.

#### Scenario: Repository has open issues
- **WHEN** the target repository contains one or more open issues
- **THEN** the system returns a complete list of all open issues including title, body, number, labels, assignees, and URL

#### Scenario: Repository has no open issues
- **WHEN** the target repository has zero open issues
- **THEN** the system returns an empty list without error

#### Scenario: Repository has more than one page of issues
- **WHEN** the target repository has more open issues than the API default page size (30)
- **THEN** the system SHALL follow pagination links and return all issues across all pages

#### Scenario: Repository is not found or access is denied
- **WHEN** the GitHub API returns HTTP 404 or HTTP 403 for the issues request
- **THEN** the system SHALL surface a clear error message indicating the repository was not found or access was denied

### Requirement: Display fetched Issues in the terminal
The system SHALL print the list of fetched open Issues to standard output in a readable format for terminal review.

#### Scenario: Issues are listed in the terminal
- **WHEN** the fetch-issues command is executed successfully
- **THEN** each issue is printed to stdout with at minimum its number and title
