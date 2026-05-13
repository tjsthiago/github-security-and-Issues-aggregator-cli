/**
 * IssueNumber Value Object
 * Immutable wrapper for a positive integer issue number.
 */
export class IssueNumber {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(value: number): IssueNumber {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('Issue number must be a positive integer');
    }
    return new IssueNumber(value);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: IssueNumber): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
