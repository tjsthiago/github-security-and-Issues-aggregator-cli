import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FetchIssuesUseCase } from '../../../src/application/use-cases/FetchIssuesUseCase';
import { FetchDependabotAlertsUseCase } from '../../../src/application/use-cases/FetchDependabotAlertsUseCase';
import { AggregateIssuesToMarkdownUseCase } from '../../../src/application/use-cases/AggregateIssuesToMarkdownUseCase';
import { AggregateAlertsToMarkdownUseCase } from '../../../src/application/use-cases/AggregateAlertsToMarkdownUseCase';
import { Issue } from '../../../src/domain/entities/Issue';
import { DependabotAlert } from '../../../src/domain/entities/DependabotAlert';

describe('FetchIssuesUseCase', () => {
  it('should fetch all open issues from repository', async () => {
    const mockIssue = Issue.create(
      1,
      'Test issue',
      'https://github.com/owner/repo/issues/1',
      'Test body'
    );

    const mockRepository = {
      findAllOpen: vi.fn().mockResolvedValueOnce([mockIssue]),
    };

    const useCase = new FetchIssuesUseCase(mockRepository as any);
    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(mockIssue);
    expect(mockRepository.findAllOpen).toHaveBeenCalled();
  });

  it('should return empty array when no issues found', async () => {
    const mockRepository = {
      findAllOpen: vi.fn().mockResolvedValueOnce([]),
    };

    const useCase = new FetchIssuesUseCase(mockRepository as any);
    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});

describe('FetchDependabotAlertsUseCase', () => {
  it('should fetch all active alerts from repository', async () => {
    const mockAlert = DependabotAlert.create(
      1,
      '@angular/core',
      '<13.0.0',
      '13.0.0',
      'critical',
      'CVE-2024-12345',
      'https://github.com/advisories/GHSA-xxxx-yyyy-zzzz',
      'Angular vulnerability'
    );

    const mockRepository = {
      findAllActive: vi.fn().mockResolvedValueOnce([mockAlert]),
    };

    const useCase = new FetchDependabotAlertsUseCase(mockRepository as any);
    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(mockAlert);
    expect(mockRepository.findAllActive).toHaveBeenCalled();
  });

  it('should return empty array when no alerts found', async () => {
    const mockRepository = {
      findAllActive: vi.fn().mockResolvedValueOnce([]),
    };

    const useCase = new FetchDependabotAlertsUseCase(mockRepository as any);
    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});

describe('AggregateIssuesToMarkdownUseCase', () => {
  it('should format single issue as markdown', async () => {
    const mockIssue = Issue.create(
      42,
      'Fix authentication',
      'https://github.com/owner/repo/issues/42',
      'Description of issue',
      ['bug', 'critical'],
      ['alice']
    );

    const mockRepository = {
      findAllOpen: vi.fn().mockResolvedValueOnce([mockIssue]),
    };

    const useCase = new AggregateIssuesToMarkdownUseCase(mockRepository as any);
    const markdown = await useCase.execute();

    expect(markdown).toContain('# 1. Fix authentication');
    expect(markdown).toContain('**Issue #42**');
    expect(markdown).toContain('https://github.com/owner/repo/issues/42');
    expect(markdown).toContain('**Labels:** bug, critical');
    expect(markdown).toContain('**Assignees:** alice');
    expect(markdown).toContain('Description of issue');
  });

  it('should format multiple issues with delimiters', async () => {
    const issue1 = Issue.create(
      1,
      'First issue',
      'https://github.com/owner/repo/issues/1',
      'Body 1'
    );
    const issue2 = Issue.create(
      2,
      'Second issue',
      'https://github.com/owner/repo/issues/2',
      'Body 2'
    );

    const mockRepository = {
      findAllOpen: vi.fn().mockResolvedValueOnce([issue1, issue2]),
    };

    const useCase = new AggregateIssuesToMarkdownUseCase(mockRepository as any);
    const markdown = await useCase.execute();

    expect(markdown).toContain('# 1. First issue');
    expect(markdown).toContain('# 2. Second issue');
    expect(markdown).toContain('---');
    // Delimiter should appear only once (between entries, not at end)
    const delimiterCount = (markdown.match(/---/g) || []).length;
    expect(delimiterCount).toBe(1);
  });

  it('should handle empty issues list', async () => {
    const mockRepository = {
      findAllOpen: vi.fn().mockResolvedValueOnce([]),
    };

    const useCase = new AggregateIssuesToMarkdownUseCase(mockRepository as any);
    const markdown = await useCase.execute();

    expect(markdown).toContain('No Open Issues');
  });

  it('should handle issue with no labels or assignees', async () => {
    const mockIssue = Issue.create(
      1,
      'Simple issue',
      'https://github.com/owner/repo/issues/1',
      'Body'
    );

    const mockRepository = {
      findAllOpen: vi.fn().mockResolvedValueOnce([mockIssue]),
    };

    const useCase = new AggregateIssuesToMarkdownUseCase(mockRepository as any);
    const markdown = await useCase.execute();

    expect(markdown).not.toContain('**Labels:**');
    expect(markdown).not.toContain('**Assignees:**');
  });

  it('should handle issue with empty body', async () => {
    const mockIssue = Issue.create(
      1,
      'Issue without body',
      'https://github.com/owner/repo/issues/1',
      ''
    );

    const mockRepository = {
      findAllOpen: vi.fn().mockResolvedValueOnce([mockIssue]),
    };

    const useCase = new AggregateIssuesToMarkdownUseCase(mockRepository as any);
    const markdown = await useCase.execute();

    expect(markdown).toContain('# 1. Issue without body');
    expect(markdown).not.toContain('**Description:**');
  });
});

describe('AggregateAlertsToMarkdownUseCase', () => {
  it('should format single alert as markdown', async () => {
    const mockAlert = DependabotAlert.create(
      123,
      '@angular/core',
      '<13.0.0',
      '13.0.0',
      'critical',
      'CVE-2024-12345',
      'https://github.com/advisories/GHSA-xxxx-yyyy-zzzz',
      'Angular contains a vulnerability'
    );

    const mockRepository = {
      findAllActive: vi.fn().mockResolvedValueOnce([mockAlert]),
    };

    const useCase = new AggregateAlertsToMarkdownUseCase(mockRepository as any);
    const markdown = await useCase.execute();

    expect(markdown).toContain('# 1. @angular/core - CRITICAL');
    expect(markdown).toContain('**Alert #123**');
    expect(markdown).toContain('**Dependency:** @angular/core');
    expect(markdown).toContain('**Vulnerable Version Range:** <13.0.0');
    expect(markdown).toContain('**Patched Version:** 13.0.0');
    expect(markdown).toContain('**Severity:** CRITICAL');
    expect(markdown).toContain('**CVE:** CVE-2024-12345');
    expect(markdown).toContain('**Advisory:** https://github.com/advisories/GHSA-xxxx-yyyy-zzzz');
    expect(markdown).toContain('Angular contains a vulnerability');
  });

  it('should format multiple alerts with delimiters', async () => {
    const alert1 = DependabotAlert.create(
      1,
      'pkg1',
      '>1.0.0',
      '2.0.0',
      'high',
      'CVE-2024-00001',
      'https://github.com/advisories/1',
      'Vulnerability 1'
    );
    const alert2 = DependabotAlert.create(
      2,
      'pkg2',
      '<2.0.0',
      '3.0.0',
      'medium',
      undefined,
      'https://github.com/advisories/2',
      'Vulnerability 2'
    );

    const mockRepository = {
      findAllActive: vi.fn().mockResolvedValueOnce([alert1, alert2]),
    };

    const useCase = new AggregateAlertsToMarkdownUseCase(mockRepository as any);
    const markdown = await useCase.execute();

    expect(markdown).toContain('# 1. pkg1 - HIGH');
    expect(markdown).toContain('# 2. pkg2 - MEDIUM');
    expect(markdown).toContain('---');
    // Delimiter should appear only once
    const delimiterCount = (markdown.match(/---/g) || []).length;
    expect(delimiterCount).toBe(1);
  });

  it('should handle empty alerts list', async () => {
    const mockRepository = {
      findAllActive: vi.fn().mockResolvedValueOnce([]),
    };

    const useCase = new AggregateAlertsToMarkdownUseCase(mockRepository as any);
    const markdown = await useCase.execute();

    expect(markdown).toContain('No Active Dependabot Alerts');
  });

  it('should handle alert without CVE', async () => {
    const mockAlert = DependabotAlert.create(
      1,
      'pkg',
      '>1.0.0',
      '2.0.0',
      'low',
      undefined,
      'https://github.com/advisories/1',
      'Summary'
    );

    const mockRepository = {
      findAllActive: vi.fn().mockResolvedValueOnce([mockAlert]),
    };

    const useCase = new AggregateAlertsToMarkdownUseCase(mockRepository as any);
    const markdown = await useCase.execute();

    expect(markdown).not.toContain('**CVE:**');
  });

  it('should handle different severity levels', async () => {
    const severities = ['critical', 'high', 'medium', 'low'];
    const alerts = severities.map((sev, idx) =>
      DependabotAlert.create(
        idx + 1,
        'pkg',
        '>1.0.0',
        '2.0.0',
        sev,
        undefined,
        'https://github.com/advisories/1',
        'Summary'
      )
    );

    const mockRepository = {
      findAllActive: vi.fn().mockResolvedValueOnce(alerts),
    };

    const useCase = new AggregateAlertsToMarkdownUseCase(mockRepository as any);
    const markdown = await useCase.execute();

    expect(markdown).toContain('- CRITICAL');
    expect(markdown).toContain('- HIGH');
    expect(markdown).toContain('- MEDIUM');
    expect(markdown).toContain('- LOW');
  });
});
