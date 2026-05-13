import { AppError } from '../../shared/errors/AppError.js';

export interface GitHubHttpClientConfig {
  token: string;
  baseUrl?: string;
}

export interface PaginationInfo {
  nextUrl?: string;
  hasNext: boolean;
}

/**
 * GitHubHttpClient
 * Wraps native fetch with GitHub API configuration.
 * Handles authentication, error handling, and pagination.
 */
export class GitHubHttpClient {
  private readonly token: string;
  private readonly baseUrl: string;

  constructor(config: GitHubHttpClientConfig) {
    this.token = config.token;
    this.baseUrl = config.baseUrl || 'https://api.github.com';
  }

  async get<T>(
    path: string,
    params?: Record<string, string | number | boolean>
  ): Promise<{ data: T; pagination: PaginationInfo }> {
    // If path starts with http, it's a full URL (for cursor-based pagination)
    const url = path.startsWith('http') ? path : this.buildUrl(path, params);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'github-issues-aggregator',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new AppError(
        `GitHub API error: ${response.status} ${response.statusText}. ${errorBody}`,
        `GITHUB_API_ERROR_${response.status}`
      );
    }

    const data = (await response.json()) as T;
    const pagination = this.parsePagination(response.headers.get('Link') || '');

    return { data, pagination };
  }

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const url = new URL(path, this.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  private parsePagination(linkHeader: string): PaginationInfo {
    const pagination: PaginationInfo = { hasNext: false };

    if (!linkHeader) {
      return pagination;
    }

    const links = linkHeader.split(',');
    for (const link of links) {
      const parts = link.split(';');
      if (parts.length === 2) {
        const urlPart = parts[0].trim();
        const relPart = parts[1].trim();

        if (relPart.includes('rel="next"')) {
          const match = urlPart.match(/<(.+?)>/);
          if (match) {
            pagination.nextUrl = match[1];
            pagination.hasNext = true;
          }
        }
      }
    }

    return pagination;
  }
}
