import { AppError } from './AppError.js';

/**
 * Validation error for input validation failures.
 * Extends AppError with code 'VALIDATION_ERROR'.
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
