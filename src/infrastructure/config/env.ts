import { ValidationError } from '../../shared/errors/ValidationError.js';

export interface Environment {
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
}

/**
 * Loads and validates required environment variables.
 * Throws ValidationError if any required variable is missing.
 */
export function loadEnvironment(): Environment {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;

  if (!GITHUB_TOKEN) {
    throw new ValidationError(
      'GITHUB_TOKEN is required. Please set it in your .env file.'
    );
  }

  if (!GITHUB_OWNER) {
    throw new ValidationError(
      'GITHUB_OWNER is required. Please set it in your .env file.'
    );
  }

  if (!GITHUB_REPO) {
    throw new ValidationError(
      'GITHUB_REPO is required. Please set it in your .env file.'
    );
  }

  return {
    GITHUB_TOKEN,
    GITHUB_OWNER,
    GITHUB_REPO,
  };
}
