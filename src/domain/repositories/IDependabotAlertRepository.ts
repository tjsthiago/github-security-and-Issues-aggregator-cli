import { DependabotAlert } from '../entities/DependabotAlert.js';

/**
 * DependabotAlertRepository Port
 * Defines the contract for fetching Dependabot alerts from a source.
 */
export interface IDependabotAlertRepository {
  findAllActive(): Promise<DependabotAlert[]>;
}
