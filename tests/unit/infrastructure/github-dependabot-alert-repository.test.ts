import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GitHubDependabotAlertRepository } from '../../../src/infrastructure/repositories/GitHubDependabotAlertRepository';
import { GitHubHttpClient } from '../../../src/infrastructure/http/GitHubHttpClient';

describe('GitHubDependabotAlertRepository', () => {
  let mockHttpClient: any;

  beforeEach(() => {
    mockHttpClient = {
      get: vi.fn(),
    };
  });

  describe('findAllActive', () => {
    it('should fetch and map alerts from GitHub API', async () => {
      const apiResponse = [
        {
          number: 1,
          dependency: {
            package: {
              ecosystem: 'npm',
              name: '@angular/core',
            },
            manifest_path: 'package.json',
            requirements: '<13.0.0',
          },
          security_advisory: {
            ghsa_id: 'GHSA-xxxx-yyyy-zzzz',
            cve_id: 'CVE-2024-12345',
            summary: 'Angular vulnerability',
            description: 'A vulnerability in Angular',
            vulnerabilities: [],
            severity: 'critical',
            cvss: { score: 9.8 },
            cwes: [],
            identifiers: [],
            references: [],
            published_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
            withdrawn_at: null,
          },
          security_update: {
            available: true,
            package_ecosystem: 'npm',
          },
          url: 'https://api.github.com/repos/owner/repo/dependabot/alerts/1',
          html_url: 'https://github.com/owner/repo/security/dependabot/1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
          dismissed_at: null,
          dismissed_by: null,
          dismissed_reason: null,
          dismissed_comment: null,
          fixed_at: null,
          state: 'open',
        },
      ];

      mockHttpClient.get.mockResolvedValueOnce({
        data: apiResponse,
        pagination: { hasNext: false },
      });

      const repository = new GitHubDependabotAlertRepository(
        mockHttpClient as GitHubHttpClient,
        'owner',
        'repo'
      );

      const alerts = await repository.findAllActive();

      expect(alerts).toHaveLength(1);
      expect(alerts[0].getNumber().getValue()).toBe(1);
      expect(alerts[0].getDependencyName()).toBe('@angular/core');
      expect(alerts[0].getSeverity().getValue()).toBe('critical');
      expect(alerts[0].getCveId().getValue()).toBe('CVE-2024-12345');
      expect(alerts[0].getGhsaUrl()).toContain('security/dependabot');
    });

    it('should return empty array when no alerts found', async () => {
      mockHttpClient.get.mockResolvedValueOnce({
        data: [],
        pagination: { hasNext: false },
      });

      const repository = new GitHubDependabotAlertRepository(
        mockHttpClient as GitHubHttpClient,
        'owner',
        'repo'
      );

      const alerts = await repository.findAllActive();

      expect(alerts).toEqual([]);
    });

    it('should handle pagination', async () => {
      const page1 = [
        {
          number: 1,
          dependency: {
            package: {
              ecosystem: 'npm',
              name: 'pkg1',
            },
            manifest_path: 'package.json',
            requirements: '>1.0.0',
          },
          security_advisory: {
            ghsa_id: 'GHSA-1111-1111-1111',
            cve_id: 'CVE-2024-00001',
            summary: 'Vulnerability 1',
            description: 'Desc 1',
            vulnerabilities: [],
            severity: 'high',
            cvss: { score: 8.0 },
            cwes: [],
            identifiers: [],
            references: [],
            published_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            withdrawn_at: null,
          },
          security_update: { available: true, package_ecosystem: 'npm' },
          url: 'https://api.github.com/repos/owner/repo/dependabot/alerts/1',
          html_url: 'https://github.com/owner/repo/security/dependabot/1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          dismissed_at: null,
          dismissed_by: null,
          dismissed_reason: null,
          dismissed_comment: null,
          fixed_at: null,
          state: 'open',
        },
      ];

      const page2 = [
        {
          number: 2,
          dependency: {
            package: {
              ecosystem: 'npm',
              name: 'pkg2',
            },
            manifest_path: 'package.json',
            requirements: '<2.0.0',
          },
          security_advisory: {
            ghsa_id: 'GHSA-2222-2222-2222',
            cve_id: null,
            summary: 'Vulnerability 2',
            description: 'Desc 2',
            vulnerabilities: [],
            severity: 'medium',
            cvss: { score: 6.0 },
            cwes: [],
            identifiers: [],
            references: [],
            published_at: '2024-01-02T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
            withdrawn_at: null,
          },
          security_update: { available: false, package_ecosystem: 'npm' },
          url: 'https://api.github.com/repos/owner/repo/dependabot/alerts/2',
          html_url: 'https://github.com/owner/repo/security/dependabot/2',
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
          dismissed_at: null,
          dismissed_by: null,
          dismissed_reason: null,
          dismissed_comment: null,
          fixed_at: null,
          state: 'open',
        },
      ];

      mockHttpClient.get
        .mockResolvedValueOnce({
          data: page1,
          pagination: { hasNext: true, nextUrl: '/repos/owner/repo/dependabot/alerts?page=2' },
        })
        .mockResolvedValueOnce({
          data: page2,
          pagination: { hasNext: false },
        });

      const repository = new GitHubDependabotAlertRepository(
        mockHttpClient as GitHubHttpClient,
        'owner',
        'repo'
      );

      const alerts = await repository.findAllActive();

      expect(alerts).toHaveLength(2);
      expect(alerts[0].getNumber().getValue()).toBe(1);
      expect(alerts[1].getNumber().getValue()).toBe(2);
    });

    it('should handle alerts with null CVE', async () => {
      const apiResponse = [
        {
          number: 1,
          dependency: {
            package: { ecosystem: 'npm', name: 'pkg' },
            manifest_path: 'package.json',
            requirements: '>1.0.0',
          },
          security_advisory: {
            ghsa_id: 'GHSA-xxxx-yyyy-zzzz',
            cve_id: null,
            summary: 'Alert without CVE',
            description: 'Desc',
            vulnerabilities: [],
            severity: 'low',
            cvss: { score: 3.0 },
            cwes: [],
            identifiers: [],
            references: [],
            published_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            withdrawn_at: null,
          },
          security_update: { available: false, package_ecosystem: 'npm' },
          url: 'https://api.github.com/repos/owner/repo/dependabot/alerts/1',
          html_url: 'https://github.com/owner/repo/security/dependabot/1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          dismissed_at: null,
          dismissed_by: null,
          dismissed_reason: null,
          dismissed_comment: null,
          fixed_at: null,
          state: 'open',
        },
      ];

      mockHttpClient.get.mockResolvedValueOnce({
        data: apiResponse,
        pagination: { hasNext: false },
      });

      const repository = new GitHubDependabotAlertRepository(
        mockHttpClient as GitHubHttpClient,
        'owner',
        'repo'
      );

      const alerts = await repository.findAllActive();

      expect(alerts[0].getCveId().hasValue()).toBe(false);
    });

    it('should throw when HTTP client throws', async () => {
      mockHttpClient.get.mockRejectedValueOnce(new Error('API error'));

      const repository = new GitHubDependabotAlertRepository(
        mockHttpClient as GitHubHttpClient,
        'owner',
        'repo'
      );

      await expect(repository.findAllActive()).rejects.toThrow('API error');
    });

    it('should call HTTP client with correct parameters', async () => {
      mockHttpClient.get.mockResolvedValueOnce({
        data: [],
        pagination: { hasNext: false },
      });

      const repository = new GitHubDependabotAlertRepository(
        mockHttpClient as GitHubHttpClient,
        'owner',
        'repo'
      );

      await repository.findAllActive();

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/repos/owner/repo/dependabot/alerts',
        expect.objectContaining({
          state: 'open',
          per_page: 100,
        })
      );
    });
  });
});
