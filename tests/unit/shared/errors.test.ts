import { describe, it, expect } from 'vitest';
import { AppError } from '../../../src/shared/errors/AppError';
import { ValidationError } from '../../../src/shared/errors/ValidationError';

describe('AppError', () => {
  it('should create an AppError with message and optional code', () => {
    const error = new AppError('Something went wrong', 'CUSTOM_CODE');
    expect(error.message).toBe('Something went wrong');
    expect(error.code).toBe('CUSTOM_CODE');
    expect(error instanceof Error).toBe(true);
    expect(error instanceof AppError).toBe(true);
  });

  it('should create an AppError with only message', () => {
    const error = new AppError('Something went wrong');
    expect(error.message).toBe('Something went wrong');
    expect(error.code).toBeUndefined();
  });

  it('should identify itself as an AppError', () => {
    const error = new AppError('Test');
    expect(error.isAppError()).toBe(true);
  });

  it('should have proper error inheritance chain', () => {
    const error = new AppError('Test', 'CODE');
    expect(error instanceof Error).toBe(true);
    expect(error instanceof AppError).toBe(true);
  });
});

describe('ValidationError', () => {
  it('should create a ValidationError with message', () => {
    const error = new ValidationError('Invalid input');
    expect(error.message).toBe('Invalid input');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error instanceof Error).toBe(true);
    expect(error instanceof AppError).toBe(true);
    expect(error instanceof ValidationError).toBe(true);
  });

  it('should identify itself as a ValidationError and AppError', () => {
    const error = new ValidationError('Invalid email');
    expect(error.isAppError()).toBe(true);
    expect(error instanceof ValidationError).toBe(true);
  });

  it('should preserve ValidationError type after throw/catch', () => {
    const throwFn = () => {
      throw new ValidationError('Invalid value');
    };

    try {
      throwFn();
    } catch (error) {
      expect(error instanceof ValidationError).toBe(true);
      expect((error as ValidationError).code).toBe('VALIDATION_ERROR');
    }
  });
});
