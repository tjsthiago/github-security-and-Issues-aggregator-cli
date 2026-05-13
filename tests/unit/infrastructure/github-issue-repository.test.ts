import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GitHubIssueRepository } from '../../../src/infrastructure/repositories/GitHubIssueRepository';
import { GitHubHttpClient } from '../../../src/infrastructure/http/GitHubHttpClient';

describe('GitHubIssueRepository', () => {
  let mockHttpClient: any;

  beforeEach(() => {
    mockHttpClient = {
      get: vi.fn(),
    };
  });

  describe('findAllOpen', () => {
    it('should fetch and map issues from GitHub API', async () => {
      const apiResponse = [
        {
          number: 1,
          title: 'Bug fix needed',
          html_url: 'https://github.com/owner/repo/issues/1',
          body: 'This is a bug',
          labels: [{ name: 'bug' }, { name: 'critical' }],
          assignees: [{ login: 'alice' }],
        },
      ];

      mockHttpClient.get.mockResolvedValueOnce({
        data: apiResponse,
        pagination: { hasNext: false },
      });

      const repository = new GitHubIssueRepository(
        mockHttpClient as GitHubHttpClient,
        'owner',
        'repo'
      );

      const issues = await repository.findAllOpen();

      expect(issues).toHaveLength(1);
      expect(issues[0].getId().getValue()).toBe(1);
      expect(issues[0].getTitle().getValue()).toBe('Bug fix needed');
      expect(issues[0].getLabels()).toEqual(['bug', 'critical']);
      expect(issues[0].getAssignees()).toEqual(['alice']);
    });

    it('should return empty array when no issues found', async () => {
      mockHttpClient.get.mockResolvedValueOnce({
        data: [],
        pagination: { hasNext: false },
      });

      const repository = new GitHubIssueRepository(
        mockHttpClient as GitHubHttpClient,
        'owner',
        'repo'
      );

      const issues = await repository.findAllOpen();

      expect(issues).toEqual([]);
    });

    it('should handle pagination', async () => {
      const page1 = [
        {
          number: 1,
          title: 'Issue 1',
          html_url: 'https://github.com/owner/repo/issues/1',
          body: 'Body 1',
          labels: [],
          assignees: [],
        },
      ];

      const page2 = [
        {
          number: 2,
          title: 'Issue 2',
          html_url: 'https://github.com/owner/repo/issues/2',
          body: 'Body 2',
          labels: [],
          assignees: [],
        },
      ];

      mockHttpClient.get
        .mockResolvedValueOnce({
          data: page1,
          pagination: {
            hasNext: true,
            nextUrl: 'https://api.github.com/repos/owner/repo/issues?page=2',
          },
        })
        .mockResolvedValueOnce({
          data: page2,
          pagination: { hasNext: false },
        });

      const repository = new GitHubIssueRepository(
        mockHttpClient as GitHubHttpClient,
        'owner',
        'repo'
      );

      const issues = await repository.findAllOpen();

      expect(issues).toHaveLength(2);
      expect(issues[0].getId().getValue()).toBe(1);
      expect(issues[1].getId().getValue()).toBe(2);
    });

    it('should handle issues with empty body', async () => {
      const apiResponse = [
        {
          number: 1,
          title: 'No body issue',
          html_url: 'https://github.com/owner/repo/issues/1',
          body: null,
          labels: [],
          assignees: [],
        },
      ];

      mockHttpClient.get.mockResolvedValueOnce({
        data: apiResponse,
        pagination: { hasNext: false },
      });

      const repository = new GitHubIssueRepository(
        mockHttpClient as GitHubHttpClient,
        'owner',
        'repo'
      );

      const issues = await repository.findAllOpen();

      expect(issues).toHaveLength(1);
      expect(issues[0].getBody()).toBe('');
    });

    it('should handle issues with no labels or assignees', async () => {
      const apiResponse = [
        {
          number: 1,
          title: 'Simple issue',
          html_url: 'https://github.com/owner/repo/issues/1',
          body: 'Description',
          labels: [],
          assignees: [],
        },
      ];

      mockHttpClient.get.mockResolvedValueOnce({
        data: apiResponse,
        pagination: { hasNext: false },
      });

      const repository = new GitHubIssueRepository(
        mockHttpClient as GitHubHttpClient,
        'owner',
        'repo'
      );

      const issues = await repository.findAllOpen();

      expect(issues[0].getLabels()).toEqual([]);
      expect(issues[0].getAssignees()).toEqual([]);
    });

    it('should throw when HTTP client throws', async () => {
      mockHttpClient.get.mockRejectedValueOnce(new Error('API error'));

      const repository = new GitHubIssueRepository(
        mockHttpClient as GitHubHttpClient,
        'owner',
        'repo'
      );

      await expect(repository.findAllOpen()).rejects.toThrow('API error');
    });

    it('should call HTTP client with correct parameters', async () => {
      mockHttpClient.get.mockResolvedValueOnce({
        data: [],
        pagination: { hasNext: false },
      });

      const repository = new GitHubIssueRepository(
        mockHttpClient as GitHubHttpClient,
        'owner',
        'repo'
      );

      await repository.findAllOpen();

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/repos/owner/repo/issues',
        expect.objectContaining({
          state: 'open',
          per_page: 100,
        })
      );
    });
  });
});
