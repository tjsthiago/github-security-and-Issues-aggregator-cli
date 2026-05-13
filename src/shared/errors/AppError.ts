/**
 * Base application error class.
 * All domain and application errors extend this class.
 */
export class AppError extends Error {
  readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  isAppError(): boolean {
    return true;
  }
}
