import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadEnvironment } from '../../../src/infrastructure/config/env';
import { ValidationError } from '../../../src/shared/errors/ValidationError';

describe('loadEnvironment', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset process.env before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should load all required environment variables when present', () => {
    process.env.GITHUB_TOKEN = 'test-token-123';
    process.env.GITHUB_OWNER = 'grupoboticario';
    process.env.GITHUB_REPO = 'test-repo';

    const env = loadEnvironment();

    expect(env.GITHUB_TOKEN).toBe('test-token-123');
    expect(env.GITHUB_OWNER).toBe('grupoboticario');
    expect(env.GITHUB_REPO).toBe('test-repo');
  });

  it('should throw ValidationError when GITHUB_TOKEN is missing', () => {
    delete process.env.GITHUB_TOKEN;
    process.env.GITHUB_OWNER = 'grupoboticario';
    process.env.GITHUB_REPO = 'test-repo';

    expect(() => loadEnvironment()).toThrow(ValidationError);
    expect(() => loadEnvironment()).toThrow('GITHUB_TOKEN is required');
  });

  it('should throw ValidationError when GITHUB_OWNER is missing', () => {
    process.env.GITHUB_TOKEN = 'test-token';
    delete process.env.GITHUB_OWNER;
    process.env.GITHUB_REPO = 'test-repo';

    expect(() => loadEnvironment()).toThrow(ValidationError);
    expect(() => loadEnvironment()).toThrow('GITHUB_OWNER is required');
  });

  it('should throw ValidationError when GITHUB_REPO is missing', () => {
    process.env.GITHUB_TOKEN = 'test-token';
    process.env.GITHUB_OWNER = 'grupoboticario';
    delete process.env.GITHUB_REPO;

    expect(() => loadEnvironment()).toThrow(ValidationError);
    expect(() => loadEnvironment()).toThrow('GITHUB_REPO is required');
  });

  it('should throw ValidationError with code VALIDATION_ERROR', () => {
    delete process.env.GITHUB_TOKEN;
    process.env.GITHUB_OWNER = 'grupoboticario';
    process.env.GITHUB_REPO = 'test-repo';

    try {
      loadEnvironment();
    } catch (error) {
      if (error instanceof ValidationError) {
        expect(error.code).toBe('VALIDATION_ERROR');
      } else {
        throw error;
      }
    }
  });

  it('should throw when all variables are missing', () => {
    delete process.env.GITHUB_TOKEN;
    delete process.env.GITHUB_OWNER;
    delete process.env.GITHUB_REPO;

    expect(() => loadEnvironment()).toThrow(ValidationError);
  });
});
