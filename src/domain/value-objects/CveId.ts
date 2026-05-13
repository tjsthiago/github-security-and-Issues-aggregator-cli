/**
 * CveId Value Object
 * Immutable wrapper for an optional CVE identifier string.
 */
export class CveId {
  private readonly value: string | null;

  private constructor(value: string | null) {
    this.value = value;
  }

  static create(value?: string): CveId {
    if (value === undefined || value === null || value.trim() === '') {
      return new CveId(null);
    }

    const trimmed = value.trim();

    // Basic CVE format validation: CVE-YYYY-XXXXX or similar
    if (!/^CVE-\d{4}-\d{4,}$/i.test(trimmed)) {
      throw new Error('Invalid CVE format. Expected format: CVE-YYYY-XXXXX');
    }

    return new CveId(trimmed.toUpperCase());
  }

  getValue(): string | null {
    return this.value;
  }

  hasValue(): boolean {
    return this.value !== null;
  }

  equals(other: CveId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value ?? 'N/A';
  }
}
