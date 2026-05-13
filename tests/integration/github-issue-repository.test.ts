import { describe, it, expect } from 'vitest';
import { GitHubIssueRepository } from '../../dist/infrastructure/repositories/GitHubIssueRepository.js';
import { GitHubHttpClient } from '../../dist/infrastructure/http/GitHubHttpClient.js';
import { loadEnvironment } from '../../dist/infrastructure/config/env.js';

describe('GitHubIssueRepository Integration', () => {
  it('should fetch open issues from GitHub API', async () => {
    // Skip if GITHUB_TOKEN is not set
    if (!process.env.GITHUB_TOKEN) {
      console.log('Skipping integration test: GITHUB_TOKEN not set');
      return;
    }

    const env = loadEnvironment();
    const httpClient = new GitHubHttpClient({ token: env.GITHUB_TOKEN });
    const repository = new GitHubIssueRepository(
      httpClient,
      env.GITHUB_OWNER,
      env.GITHUB_REPO
    );

    const issues = await repository.findAllOpen();

    // Assert that we get an array back
    expect(Array.isArray(issues)).toBe(true);

    // If there are issues, validate their structure
    if (issues.length > 0) {
      const firstIssue = issues[0];
      expect(firstIssue.getId().getValue()).toBeGreaterThan(0);
      expect(firstIssue.getTitle().getValue()).toBeTruthy();
      expect(firstIssue.getUrl().getValue()).toContain('github.com');
    }
  }, 30000); // 30 second timeout for API call
});
