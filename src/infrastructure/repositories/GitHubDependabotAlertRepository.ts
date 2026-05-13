import { GitHubHttpClient } from '../http/GitHubHttpClient.js';
import { DependabotAlert } from '../../domain/entities/DependabotAlert.js';
import { IDependabotAlertRepository } from '../../domain/repositories/IDependabotAlertRepository.js';

interface GitHubAlertVulnerability {
  cve_id: string | null;
  ghsa_id: string;
  cvss: {
    score: number;
  };
  severity: string;
}

interface GitHubDependabotAlertResponse {
  number: number;
  dependency: {
    package: {
      ecosystem: string;
      name: string;
    };
    manifest_path: string;
    requirements: string;
  };
  security_advisory: {
    ghsa_id: string;
    cve_id: string | null;
    summary: string;
    description: string;
    vulnerabilities: GitHubAlertVulnerability[];
    severity: string;
    cvss: {
      score: number;
    };
    cwes: string[];
    identifiers: Array<{ type: string; value: string }>;
    references: Array<{ url: string }>;
    published_at: string;
    updated_at: string;
    withdrawn_at: string | null;
  };
  security_update: {
    available: boolean;
    package_ecosystem: string;
  };
  url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  dismissed_at: string | null;
  dismissed_by: null;
  dismissed_reason: null;
  dismissed_comment: null;
  fixed_at: null;
  state: string;
}

/**
 * GitHubDependabotAlertRepository Adapter
 * Implements IDependabotAlertRepository using GitHub API.
 */
export class GitHubDependabotAlertRepository implements IDependabotAlertRepository {
  constructor(
    private readonly httpClient: GitHubHttpClient,
    private readonly owner: string,
    private readonly repo: string
  ) {}

  async findAllActive(): Promise<DependabotAlert[]> {
    const alerts: DependabotAlert[] = [];
    let nextUrl: string = `/repos/${this.owner}/${this.repo}/dependabot/alerts`;
    let hasMore = true;

    while (hasMore) {
      const result = await this.httpClient.get<GitHubDependabotAlertResponse[]>(
        nextUrl,
        {
          state: 'open',
          per_page: 100,
        }
      );

      const alertsData = Array.isArray(result.data) ? result.data : [];

      alertsData.forEach((apiAlert: GitHubDependabotAlertResponse) => {
        const alert = DependabotAlert.create(
          apiAlert.number,
          apiAlert.dependency.package.name,
          apiAlert.dependency.requirements || 'unknown',
          this.extractPatchedVersion(apiAlert),
          apiAlert.security_advisory.severity || 'unknown',
          apiAlert.security_advisory.cve_id || undefined,
          apiAlert.html_url,
          apiAlert.security_advisory.summary
        );
        alerts.push(alert);
      });

      hasMore = result.pagination.hasNext;
      if (result.pagination.nextUrl) {
        nextUrl = result.pagination.nextUrl;
      } else {
        hasMore = false;
      }
    }

    return alerts;
  }

  private extractPatchedVersion(alert: GitHubDependabotAlertResponse): string {
    // The GitHub API doesn't directly provide a patched version in recent responses
    // We try to infer it from security_update or return a generic message
    if (alert.security_update?.available) {
      return 'check GitHub UI for patch';
    }
    return 'no patch available';
  }
}
