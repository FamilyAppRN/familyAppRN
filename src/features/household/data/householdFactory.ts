import { createApiClient } from '@core/network/apiClient';
import { HouseholdRepository } from '@features/household/data/repository/HouseholdRepository';

let repo: HouseholdRepository | null = null;

export function getHouseholdRepository(): HouseholdRepository {
  if (!repo) {
    repo = new HouseholdRepository(createApiClient());
  }
  return repo;
}
