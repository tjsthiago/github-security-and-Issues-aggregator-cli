import { describe, it, expect } from 'vitest';
import { GitHubDependabotAlertRepository } from '../../dist/infrastructure/repositories/GitHubDependabotAlertRepository.js';
import { GitHubHttpClient } from '../../dist/infrastructure/http/GitHubHttpClient.js';
import { loadEnvironment } from '../../dist/infrastructure/config/env.js';

describe('GitHubDependabotAlertRepository Integration', () => {
  it('should fetch active Dependabot alerts from GitHub API', async () => {
    // Skip if GITHUB_TOKEN is not set
    if (!process.env.GITHUB_TOKEN) {
      console.log(
        'Skipping integration test: GITHUB_TOKEN not set'
      );
      return;
    }

    const env = loadEnvironment();
    const httpClient = new GitHubHttpClient({ token: env.GITHUB_TOKEN });
    const repository = new GitHubDependabotAlertRepository(
      httpClient,
      env.GITHUB_OWNER,
      env.GITHUB_REPO
    );

    const alerts = await repository.findAllActive();

    // Assert that we get an array back
    expect(Array.isArray(alerts)).toBe(true);

    // If there are alerts, validate their structure
    if (alerts.length > 0) {
      const firstAlert = alerts[0];
      expect(firstAlert.getNumber().getValue()).toBeGreaterThan(0);
      expect(firstAlert.getDependencyName()).toBeTruthy();
      expect(firstAlert.getSeverity().getValue()).toBeTruthy();
      expect(firstAlert.getGhsaUrl()).toContain('github.com');
    }
  }, 30000); // 30 second timeout for API call
});
