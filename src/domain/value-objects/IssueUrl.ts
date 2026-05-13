/**
 * IssueUrl Value Object
 * Immutable wrapper for a valid URL string pointing to a GitHub issue.
 */
export class IssueUrl {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): IssueUrl {
    const trimmed = value.trim();
    
    // Basic URL validation
    try {
      new URL(trimmed);
    } catch {
      throw new Error('Issue URL must be a valid URL');
    }

    if (!trimmed.includes('github.com')) {
      throw new Error('Issue URL must be from github.com');
    }

    return new IssueUrl(trimmed);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: IssueUrl): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
