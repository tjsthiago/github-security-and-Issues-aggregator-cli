import { DependabotAlert } from '../../domain/entities/DependabotAlert.js';
import { IDependabotAlertRepository } from '../../domain/repositories/IDependabotAlertRepository.js';

/**
 * AggregateAlertsToMarkdownUseCase
 * Application use case to fetch Dependabot alerts and format them as Markdown.
 * Each alert is numbered sequentially and separated by ---.
 */
export class AggregateAlertsToMarkdownUseCase {
  constructor(private readonly alertRepository: IDependabotAlertRepository) {}

  async execute(): Promise<string> {
    const alerts = await this.alertRepository.findAllActive();
    return this.formatAlertsAsMarkdown(alerts);
  }

  private formatAlertsAsMarkdown(alerts: DependabotAlert[]): string {
    if (alerts.length === 0) {
      return '# No Active Dependabot Alerts\n\nRepository is secure!';
    }

    const lines: string[] = [];

    alerts.forEach((alert, index) => {
      const sequentialIndex = index + 1;
      const severity = alert.getSeverity().getValue().toUpperCase();

      // Title with sequential index and severity
      lines.push(
        `# ${sequentialIndex}. ${alert.getDependencyName()} - ${severity}`
      );
      lines.push('');

      // Alert number
      lines.push(`**Alert #${alert.getNumber().getValue()}**`);
      lines.push('');

      // Dependency information
      lines.push(`**Dependency:** ${alert.getDependencyName()}`);
      lines.push('');

      lines.push(`**Vulnerable Version Range:** ${alert.getVulnerableVersionRange()}`);
      lines.push('');

      lines.push(`**Patched Version:** ${alert.getPatchedVersion()}`);
      lines.push('');

      lines.push(`**Severity:** ${severity}`);
      lines.push('');

      // CVE
      const cveId = alert.getCveId();
      if (cveId.hasValue()) {
        lines.push(`**CVE:** ${cveId.getValue()}`);
        lines.push('');
      }

      // GHSA/Advisory URL
      lines.push(`**Advisory:** ${alert.getGhsaUrl()}`);
      lines.push('');

      // Summary
      if (alert.getSummary()) {
        lines.push('**Summary:**');
        lines.push('');
        lines.push(alert.getSummary());
        lines.push('');
      }

      // Delimiter between entries (not after the last one)
      if (index < alerts.length - 1) {
        lines.push('---');
        lines.push('');
      }
    });

    return lines.join('\n');
  }
}
