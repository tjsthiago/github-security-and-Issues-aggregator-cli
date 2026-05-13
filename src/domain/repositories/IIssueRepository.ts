import { Issue } from '../entities/Issue.js';

/**
 * IssueRepository Port
 * Defines the contract for fetching issues from a source.
 */
export interface IIssueRepository {
  findAllOpen(): Promise<Issue[]>;
}
