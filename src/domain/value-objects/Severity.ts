/**
 * Severity Value Object
 * Immutable enum for vulnerability severity levels.
 */
export type SeverityType = 'critical' | 'high' | 'medium' | 'low';

export class Severity {
  private readonly value: SeverityType;

  private constructor(value: SeverityType) {
    this.value = value;
  }

  static create(value: string): Severity {
    const normalized = value.toLowerCase();
    const validSeverities: SeverityType[] = ['critical', 'high', 'medium', 'low'];

    if (!validSeverities.includes(normalized as SeverityType)) {
      throw new Error(
        `Severity must be one of: ${validSeverities.join(', ')}`
      );
    }

    return new Severity(normalized as SeverityType);
  }

  getValue(): SeverityType {
    return this.value;
  }

  equals(other: Severity): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
