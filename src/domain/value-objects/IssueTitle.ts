/**
 * IssueTitle Value Object
 * Immutable wrapper for a non-empty string issue title.
 */
export class IssueTitle {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): IssueTitle {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new Error('Issue title cannot be empty');
    }
    return new IssueTitle(trimmed);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: IssueTitle): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
