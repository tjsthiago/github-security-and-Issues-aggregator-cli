import { Issue } from '../../domain/entities/Issue.js';
import { IIssueRepository } from '../../domain/repositories/IIssueRepository.js';

/**
 * FetchIssuesUseCase
 * Application use case to fetch all open issues from the repository.
 */
export class FetchIssuesUseCase {
  constructor(private readonly issueRepository: IIssueRepository) {}

  async execute(): Promise<Issue[]> {
    return this.issueRepository.findAllOpen();
  }
}
