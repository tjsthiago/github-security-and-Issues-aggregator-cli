import { IssueNumber } from '../value-objects/IssueNumber.js';
import { IssueTitle } from '../value-objects/IssueTitle.js';
import { IssueUrl } from '../value-objects/IssueUrl.js';

/**
 * Issue Entity
 * Represents a GitHub issue with a unique identity (number).
 */
export class Issue {
  private readonly id: IssueNumber;
  private readonly title: IssueTitle;
  private readonly url: IssueUrl;
  private readonly body: string;
  private readonly labels: string[];
  private readonly assignees: string[];

  private constructor(
    id: IssueNumber,
    title: IssueTitle,
    url: IssueUrl,
    body: string,
    labels: string[],
    assignees: string[]
  ) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.body = body;
    this.labels = labels;
    this.assignees = assignees;
  }

  static create(
    number: number,
    title: string,
    url: string,
    body: string,
    labels: string[] = [],
    assignees: string[] = []
  ): Issue {
    return new Issue(
      IssueNumber.create(number),
      IssueTitle.create(title),
      IssueUrl.create(url),
      body,
      labels,
      assignees
    );
  }

  getId(): IssueNumber {
    return this.id;
  }

  getTitle(): IssueTitle {
    return this.title;
  }

  getUrl(): IssueUrl {
    return this.url;
  }

  getBody(): string {
    return this.body;
  }

  getLabels(): string[] {
    return [...this.labels];
  }

  getAssignees(): string[] {
    return [...this.assignees];
  }

  equals(other: Issue): boolean {
    return this.id.equals(other.id);
  }
}
