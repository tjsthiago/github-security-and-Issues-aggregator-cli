import { AlertNumber } from '../value-objects/AlertNumber.js';
import { Severity } from '../value-objects/Severity.js';
import { CveId } from '../value-objects/CveId.js';

/**
 * DependabotAlert Entity
 * Represents a GitHub Dependabot security alert with a unique identity (number).
 */
export class DependabotAlert {
  private readonly number: AlertNumber;
  private readonly dependencyName: string;
  private readonly vulnerableVersionRange: string;
  private readonly patchedVersion: string;
  private readonly severity: Severity;
  private readonly cveId: CveId;
  private readonly ghsaUrl: string;
  private readonly summary: string;

  private constructor(
    number: AlertNumber,
    dependencyName: string,
    vulnerableVersionRange: string,
    patchedVersion: string,
    severity: Severity,
    cveId: CveId,
    ghsaUrl: string,
    summary: string
  ) {
    this.number = number;
    this.dependencyName = dependencyName;
    this.vulnerableVersionRange = vulnerableVersionRange;
    this.patchedVersion = patchedVersion;
    this.severity = severity;
    this.cveId = cveId;
    this.ghsaUrl = ghsaUrl;
    this.summary = summary;
  }

  static create(
    number: number,
    dependencyName: string,
    vulnerableVersionRange: string,
    patchedVersion: string,
    severity: string,
    cveId: string | undefined,
    ghsaUrl: string,
    summary: string
  ): DependabotAlert {
    return new DependabotAlert(
      AlertNumber.create(number),
      dependencyName,
      vulnerableVersionRange,
      patchedVersion,
      Severity.create(severity),
      CveId.create(cveId),
      ghsaUrl,
      summary
    );
  }

  getNumber(): AlertNumber {
    return this.number;
  }

  getDependencyName(): string {
    return this.dependencyName;
  }

  getVulnerableVersionRange(): string {
    return this.vulnerableVersionRange;
  }

  getPatchedVersion(): string {
    return this.patchedVersion;
  }

  getSeverity(): Severity {
    return this.severity;
  }

  getCveId(): CveId {
    return this.cveId;
  }

  getGhsaUrl(): string {
    return this.ghsaUrl;
  }

  getSummary(): string {
    return this.summary;
  }

  equals(other: DependabotAlert): boolean {
    return this.number.equals(other.number);
  }
}
