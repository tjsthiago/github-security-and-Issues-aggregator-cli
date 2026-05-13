import { GitHubHttpClient } from '../http/GitHubHttpClient.js';
import { Issue } from '../../domain/entities/Issue.js';
import { IIssueRepository } from '../../domain/repositories/IIssueRepository.js';

interface GitHubIssueResponse {
  number: number;
  title: string;
  html_url: string;
  body: string;
  labels: Array<{ name: string }>;
  assignees: Array<{ login: string }>;
}

/**
 * GitHubIssueRepository Adapter
 * Implements IIssueRepository using GitHub API.
 */
export class GitHubIssueRepository implements IIssueRepository {
  constructor(
    private readonly httpClient: GitHubHttpClient,
    private readonly owner: string,
    private readonly repo: string
  ) {}

  async findAllOpen(): Promise<Issue[]> {
    const issues: Issue[] = [];
    let nextUrl: string = `/repos/${this.owner}/${this.repo}/issues`;
    let hasMore = true;

    while (hasMore) {
      const result = await this.httpClient.get<GitHubIssueResponse[]>(
        nextUrl,
        {
          state: 'open',
          per_page: 100,
        }
      );

      const issuesData = Array.isArray(result.data) ? result.data : [];

      issuesData.forEach((apiIssue: GitHubIssueResponse) => {
        const issue = Issue.create(
          apiIssue.number,
          apiIssue.title,
          apiIssue.html_url,
          apiIssue.body || '',
          apiIssue.labels.map((label: { name: string }) => label.name),
          apiIssue.assignees.map((assignee: { login: string }) => assignee.login)
        );
        issues.push(issue);
      });

      hasMore = result.pagination.hasNext;
      if (result.pagination.nextUrl) {
        nextUrl = result.pagination.nextUrl;
      } else {
        hasMore = false;
      }
    }

    return issues;
  }
}
