import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GitHubHttpClient } from '../../../src/infrastructure/http/GitHubHttpClient';
import { AppError } from '../../../src/shared/errors/AppError';

// Mock fetch globally
global.fetch = vi.fn();

describe('GitHubHttpClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create client with custom base URL', () => {
      const client = new GitHubHttpClient({
        token: 'test-token',
        baseUrl: 'https://custom.github.com/api/v3',
      });
      expect(client).toBeDefined();
    });

    it('should use default base URL when not provided', () => {
      const client = new GitHubHttpClient({ token: 'test-token' });
      expect(client).toBeDefined();
    });
  });

  describe('get method', () => {
    it('should set correct headers including Authorization', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: 'test' }),
        headers: new Map([['Link', '']]),
        get: (name: string) => {
          const headers = new Map([['Link', '']]);
          return headers.get(name);
        },
      } as unknown as Response;

      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      const client = new GitHubHttpClient({ token: 'test-token' });
      await client.get('/repos/test/test/issues');

      expect(vi.mocked(global.fetch)).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
            Accept: 'application/vnd.github+json',
            'User-Agent': 'github-issues-aggregator',
          }),
        })
      );
    });

    it('should build correct URL with path', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ([]),
        headers: new Map(),
        get: () => null,
      } as unknown as Response;

      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      const client = new GitHubHttpClient({ token: 'test-token' });
      await client.get('/repos/owner/repo/issues');

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string;
      expect(callUrl).toContain('https://api.github.com/repos/owner/repo/issues');
    });

    it('should include query parameters in URL', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ([]),
        headers: new Map(),
        get: () => null,
      } as unknown as Response;

      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      const client = new GitHubHttpClient({ token: 'test-token' });
      await client.get('/repos/owner/repo/issues', {
        state: 'open',
        per_page: 100,
      });

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string;
      expect(callUrl).toContain('state=open');
      expect(callUrl).toContain('per_page=100');
    });

    it('should return parsed data and pagination info on success', async () => {
      const testData = [{ id: 1, title: 'Issue' }];
      const mockResponse = {
        ok: true,
        json: async () => testData,
        headers: new Map([['Link', '<https://api.github.com/page2>; rel="next"']]),
        get: (name: string) => {
          const headers = new Map([['Link', '<https://api.github.com/page2>; rel="next"']]);
          return headers.get(name);
        },
      } as unknown as Response;

      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      const client = new GitHubHttpClient({ token: 'test-token' });
      const result = await client.get('/repos/owner/repo/issues');

      expect(result.data).toEqual(testData);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.nextUrl).toBe('https://api.github.com/page2');
    });

    it('should throw AppError on 401 Unauthorized', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Invalid token',
        headers: new Map(),
        get: () => null,
      } as unknown as Response;

      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      const client = new GitHubHttpClient({ token: 'invalid-token' });

      await expect(client.get('/repos/owner/repo/issues')).rejects.toThrow(
        AppError
      );
    });

    it('should throw AppError on 403 Forbidden', async () => {
      const mockResponse = {
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        text: async () => 'Resource not accessible',
      } as unknown as Response;

      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      const client = new GitHubHttpClient({ token: 'test-token' });

      await expect(client.get('/repos/owner/repo/dependabot/alerts')).rejects.toThrow(
        AppError
      );
    });

    it('should throw AppError on 404 Not Found', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Repository not found',
      } as unknown as Response;

      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      const client = new GitHubHttpClient({ token: 'test-token' });

      await expect(client.get('/repos/invalid/repo/issues')).rejects.toThrow(
        AppError
      );
    });

    it('should handle pagination without Link header', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ([]),
        headers: new Map(),
        get: () => null,
      } as unknown as Response;

      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      const client = new GitHubHttpClient({ token: 'test-token' });
      const result = await client.get('/repos/owner/repo/issues');

      expect(result.pagination.hasNext).toBe(false);
      expect(result.pagination.nextUrl).toBeUndefined();
    });
  });

  describe('pagination parsing', () => {
    it('should parse multiple links from Link header', async () => {
      const linkHeader =
        '<https://api.github.com/page2>; rel="next", <https://api.github.com/last>; rel="last"';
      const mockResponse = {
        ok: true,
        json: async () => ([]),
        headers: new Map([['Link', linkHeader]]),
        get: (name: string) => {
          const headers = new Map([['Link', linkHeader]]);
          return headers.get(name);
        },
      } as unknown as Response;

      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      const client = new GitHubHttpClient({ token: 'test-token' });
      const result = await client.get('/repos/owner/repo/issues');

      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.nextUrl).toBe('https://api.github.com/page2');
    });
  });
});
