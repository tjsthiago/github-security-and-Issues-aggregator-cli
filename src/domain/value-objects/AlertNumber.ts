/**
 * AlertNumber Value Object
 * Immutable wrapper for a positive integer alert number.
 */
export class AlertNumber {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(value: number): AlertNumber {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('Alert number must be a positive integer');
    }
    return new AlertNumber(value);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: AlertNumber): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
