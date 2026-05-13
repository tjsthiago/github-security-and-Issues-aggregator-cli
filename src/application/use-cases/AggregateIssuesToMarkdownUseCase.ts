import { Issue } from '../../domain/entities/Issue.js';
import { IIssueRepository } from '../../domain/repositories/IIssueRepository.js';

/**
 * AggregateIssuesToMarkdownUseCase
 * Application use case to fetch issues and format them as Markdown.
 * Each issue is numbered sequentially and separated by ---.
 */
export class AggregateIssuesToMarkdownUseCase {
  constructor(private readonly issueRepository: IIssueRepository) {}

  async execute(): Promise<string> {
    const issues = await this.issueRepository.findAllOpen();
    return this.formatIssuesAsMarkdown(issues);
  }

  private formatIssuesAsMarkdown(issues: Issue[]): string {
    if (issues.length === 0) {
      return '# No Open Issues\n\nAll systems operational!';
    }

    const lines: string[] = [];

    issues.forEach((issue, index) => {
      const sequentialIndex = index + 1;

      // Title with sequential index
      lines.push(`# ${sequentialIndex}. ${issue.getTitle().getValue()}`);
      lines.push('');

      // Issue metadata
      lines.push(`**Issue #${issue.getId().getValue()}**`);
      lines.push('');

      lines.push(`**URL:** ${issue.getUrl().getValue()}`);
      lines.push('');

      // Labels
      const labels = issue.getLabels();
      if (labels.length > 0) {
        lines.push(`**Labels:** ${labels.join(', ')}`);
        lines.push('');
      }

      // Assignees
      const assignees = issue.getAssignees();
      if (assignees.length > 0) {
        lines.push(`**Assignees:** ${assignees.join(', ')}`);
        lines.push('');
      }

      // Body
      if (issue.getBody()) {
        lines.push('**Description:**');
        lines.push('');
        lines.push(issue.getBody());
        lines.push('');
      }

      // Delimiter between entries (not after the last one)
      if (index < issues.length - 1) {
        lines.push('---');
        lines.push('');
      }
    });

    return lines.join('\n');
  }
}
