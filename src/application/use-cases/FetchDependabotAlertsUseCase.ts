import { DependabotAlert } from '../../domain/entities/DependabotAlert.js';
import { IDependabotAlertRepository } from '../../domain/repositories/IDependabotAlertRepository.js';

/**
 * FetchDependabotAlertsUseCase
 * Application use case to fetch all active Dependabot alerts from the repository.
 */
export class FetchDependabotAlertsUseCase {
  constructor(private readonly alertRepository: IDependabotAlertRepository) {}

  async execute(): Promise<DependabotAlert[]> {
    return this.alertRepository.findAllActive();
  }
}
